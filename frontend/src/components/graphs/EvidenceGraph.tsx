import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { GraphData, GraphNode, GraphEdge } from '@/types';
import { NODE_COLORS } from '@/types';

interface EvidenceGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
}

export default function EvidenceGraph({ data, width = 800, height = 500 }: EvidenceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Arrow markers
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#4B5563');

    // Force simulation
    const simulation = d3.forceSimulation<GraphNode>(data.nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(data.edges)
        .id((d) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Edges
    const link = g.selectAll<SVGLineElement, GraphEdge>('.link')
      .data(data.edges)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#4B5563')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)');

    // Edge labels
    const linkLabel = g.selectAll<SVGTextElement, GraphEdge>('.link-label')
      .data(data.edges)
      .join('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .attr('fill', '#6B7280')
      .text((d) => d.label || '');

    // Nodes
    const node = g.selectAll<SVGGElement, GraphNode>('.node')
      .data(data.nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'grab');

    // Node circles
    node.append('circle')
      .attr('r', 12)
      .attr('fill', (d) => (NODE_COLORS[d.type] || '#6B7280') + '40')
      .attr('stroke', (d) => NODE_COLORS[d.type] || '#6B7280')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('dy', 24)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', '#9CA3AF')
      .text((d) => d.label);

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    node.call(drag);

    // Hover highlight
    node.on('mouseover', function (_event, d) {
      const connectedIds = new Set<string>();
      connectedIds.add(d.id);
      data.edges.forEach((e) => {
        const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
        const targetId = typeof e.target === 'string' ? e.target : e.target.id;
        if (sourceId === d.id) connectedIds.add(targetId);
        if (targetId === d.id) connectedIds.add(sourceId);
      });
      node.style('opacity', (n) => connectedIds.has(n.id) ? 1 : 0.2);
      link.style('opacity', (l) => {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
        const targetId = typeof l.target === 'string' ? l.target : l.target.id;
        return sourceId === d.id || targetId === d.id ? 1 : 0.1;
      });
    }).on('mouseout', () => {
      node.style('opacity', 1);
      link.style('opacity', 1);
    });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x ?? 0)
        .attr('y1', (d) => (d.source as GraphNode).y ?? 0)
        .attr('x2', (d) => (d.target as GraphNode).x ?? 0)
        .attr('y2', (d) => (d.target as GraphNode).y ?? 0);

      linkLabel
        .attr('x', (d) => (((d.source as GraphNode).x ?? 0) + ((d.target as GraphNode).x ?? 0)) / 2)
        .attr('y', (d) => (((d.source as GraphNode).y ?? 0) + ((d.target as GraphNode).y ?? 0)) / 2);

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => { simulation.stop(); };
  }, [data, width, height]);

  if (data.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 text-sm">
        No graph data available
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="bg-sentinel-bg rounded-lg border border-sentinel-border"
    />
  );
}

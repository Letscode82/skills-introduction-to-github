const BASE_URL = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error', code: 'UNKNOWN' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => fetchJson<import('@/types').HealthStatus>('/health'),

  modules: () => fetchJson<import('@/types').ModuleDefinition[]>('/modules'),

  alerts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJson<import('@/types').Page<import('@/types').Alert>>(`/alerts${query}`);
  },

  alert: (id: string) => fetchJson<import('@/types').Alert>(`/alerts/${id}`),

  alertEmails: (id: string) => fetchJson<unknown[]>(`/alerts/${id}/emails`),

  alertCalendar: (id: string) => fetchJson<unknown[]>(`/alerts/${id}/calendar`),

  alertGraph: (id: string) => fetchJson<import('@/types').GraphData>(`/alerts/${id}/graph`),

  entities: () => fetchJson<import('@/types').AbgEntity[]>('/entities'),

  entity: (id: string) => fetchJson<import('@/types').AbgEntity>(`/entities/${id}`),

  investigations: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJson<import('@/types').Page<import('@/types').Investigation>>(`/investigations${query}`);
  },

  investigation: (id: string) => fetchJson<import('@/types').Investigation>(`/investigations/${id}`),

  proactive: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJson<import('@/types').Page<import('@/types').ProactiveAlert>>(`/proactive${query}`);
  },

  warRoom: () => fetchJson<import('@/types').WarRoom>('/war-room'),

  roi: () => fetchJson<import('@/types').RoiData>('/roi'),

  learning: () => fetchJson<import('@/types').LearningStats>('/learning'),

  autoDisposed: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJson<import('@/types').Page<import('@/types').Alert>>(`/learning/auto-disposed${query}`);
  },

  approveAutoDisposition: (id: string) =>
    fetchJson<import('@/types').Alert>(`/learning/auto-disposed/${id}/approve`, { method: 'POST' }),

  overrideAutoDisposition: (id: string) =>
    fetchJson<import('@/types').Alert>(`/learning/auto-disposed/${id}/override`, { method: 'POST' }),

  copilotGenerate: (request: import('@/types').CopilotRequest) =>
    fetchJson<import('@/types').CopilotResponse>('/copilot/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  copilotAsk: (question: string, alertId?: string) =>
    fetchJson<import('@/types').CopilotResponse>('/copilot/ask', {
      method: 'POST',
      body: JSON.stringify({ question, alertId }),
    }),
};

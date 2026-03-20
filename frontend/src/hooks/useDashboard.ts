import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: () => api.entities(),
  });
}

export function useWarRoom() {
  return useQuery({
    queryKey: ['war-room'],
    queryFn: () => api.warRoom(),
    refetchInterval: 30000,
  });
}

export function useRoi() {
  return useQuery({
    queryKey: ['roi'],
    queryFn: () => api.roi(),
  });
}

export function useLearningStats() {
  return useQuery({
    queryKey: ['learning-stats'],
    queryFn: () => api.learning(),
  });
}

export function useInvestigations(params?: { status?: string; page?: number }) {
  const queryParams: Record<string, string> = {};
  if (params?.status) queryParams.status = params.status;
  if (params?.page !== undefined) queryParams.page = String(params.page);
  return useQuery({
    queryKey: ['investigations', queryParams],
    queryFn: () => api.investigations(queryParams),
  });
}

export function useProactiveAlerts(page?: number) {
  return useQuery({
    queryKey: ['proactive-alerts', page],
    queryFn: () => api.proactive({ page: String(page ?? 0) }),
  });
}

export function useModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: () => api.modules(),
  });
}

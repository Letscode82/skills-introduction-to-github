import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Module, Severity } from '@/types';

export function useAlerts(params?: { module?: Module; severity?: Severity; page?: number; size?: number }) {
  const queryParams: Record<string, string> = {};
  if (params?.module) queryParams.module = params.module;
  if (params?.severity) queryParams.severity = params.severity;
  if (params?.page !== undefined) queryParams.page = String(params.page);
  if (params?.size) queryParams.size = String(params.size);

  return useQuery({
    queryKey: ['alerts', queryParams],
    queryFn: () => api.alerts(queryParams),
  });
}

export function useAlert(id: string | null) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: () => api.alert(id!),
    enabled: !!id,
  });
}

export function useAlertGraph(id: string | null) {
  return useQuery({
    queryKey: ['alert-graph', id],
    queryFn: () => api.alertGraph(id!),
    enabled: !!id,
  });
}

export function useAutoDisposed(page?: number) {
  return useQuery({
    queryKey: ['auto-disposed', page],
    queryFn: () => api.autoDisposed({ page: String(page ?? 0) }),
  });
}

export function useApproveAutoDisposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.approveAutoDisposition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-disposed'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useOverrideAutoDisposition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.overrideAutoDisposition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-disposed'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

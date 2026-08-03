import type { DashboardData } from '@repo/types';
import api from './api';

export const dashboardApi = {
  get: () => api.get<DashboardData>('/dashboard'),
};
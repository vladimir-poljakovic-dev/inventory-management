import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import type { DashboardData } from '@repo/types';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

@Get()
async getDashboard(): Promise<DashboardData> {
  return this.dashboardService.getDashboard();
}
}
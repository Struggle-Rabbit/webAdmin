import request from './request'
import type { DashboardStats, ChartData } from '@/types'

export interface ChartResponse {
  registrationTrend: { date: string; count: number }[]
  roleDistribution: { name: string; value: number }[]
}

export function getDashboardStatsApi() {
  return request.get<any, DashboardStats>('/dashboard/stats')
}

export function getDashboardChartsApi() {
  return request.get<any, ChartResponse>('/dashboard/charts')
}

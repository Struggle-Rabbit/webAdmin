import request from './request'
import type { LogInfo, PageResult } from '@/types'

export interface LogQueryParams {
  page: number
  pageSize: number
  type?: string
  keyword?: string
  startTime?: string
  endTime?: string
}

export function getLogListApi(params: LogQueryParams) {
  return request.get<any, PageResult<LogInfo>>('/logs', { params })
}

export function getLogDetailApi(id: number) {
  return request.get<any, LogInfo>(`/logs/${id}/detail`)
}

export async function exportLogsApi(params: { type?: string }) {
  const data = await request.get<any, { csv: string }>('/logs/export', { params })
  return new Blob([data.csv], { type: 'text/csv;charset=utf-8;' })
}

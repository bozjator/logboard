export interface MonitoringLogListFilters {
  level: string[];
  context: string[];
  requestUrl: string[];
  requestIp: string[];
  responseStatusCode: number[];
  requestMethod: string[];
  requestOrigin: string[];
  requestReferer: string[];
}

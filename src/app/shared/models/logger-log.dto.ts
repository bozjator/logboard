interface LoggerLogResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

interface LoggerLogRequest {
  ip: string;
  url: string;
  method: string;
  headers: object;
  body?: object | object[] | unknown;
}

export interface LoggerLog {
  level: string;
  context: string;
  info: string;
  errorStack?: string;
  queueJobData?: string;
  responseStatusCode?: number;
  response?: LoggerLogResponse;
  requestIp?: string;
  requestMethod?: string;
  requestUrl?: string;
  requestOrigin?: string;
  requestReferer?: string;
  request?: LoggerLogRequest;
  timestamp: string;
}

import { PaginationQuery } from './pagination.model';

export enum LogSortColumn {
  level = 'level',
  context = 'context',
  responseStatusCode = 'responseStatusCode',
  requestIp = 'requestIp',
  requestMethod = 'requestMethod',
  requestUrl = 'requestUrl',
  requestOrigin = 'requestOrigin',
  requestReferer = 'requestReferer',
  createdAt = 'createdAt',
}

export interface LogsQuery extends PaginationQuery {
  sortColumn: LogSortColumn;
  level?: string;
}

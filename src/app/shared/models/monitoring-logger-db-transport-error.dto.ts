import { LoggerLog } from './logger-log.dto';

export interface MonitoringLoggerDBTransportError {
  error: object;
  loggerRecord: LoggerLog;
}

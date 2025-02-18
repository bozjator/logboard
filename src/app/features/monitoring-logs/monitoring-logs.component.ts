import { Component, effect, inject, input, signal } from '@angular/core';
import { MonitoringEndpoint } from '../../shared/models/monitoring-endpoint.model';
import { ApiMonitoringService } from '../../shared/services/api-monitoring.service';
import { SortOrder } from '../../shared/models/sort-order.enum';
import { LogSortColumn, LogsQuery } from '../../shared/models/logs-query.model';
import { LogsTableComponent } from './components/logs-table/logs-table.component';
import { MonitoringLogList } from '../../shared/models/monitoring-log-list.dto';

@Component({
  selector: 'app-monitoring-logs',
  imports: [LogsTableComponent],
  template: ` <app-logs-table [logs]="logs()" /> `,
})
export class MonitoringLogsComponent {
  private apiMonitoringService = inject(ApiMonitoringService);

  endpoint = input<MonitoringEndpoint>();

  private logsQueryDefault: LogsQuery = {
    pageNumber: 1,
    pageItems: 10,
    sortOrder: SortOrder.asc,
    sortColumn: LogSortColumn.createdAt,
  };
  private logsQuery: LogsQuery = { ...this.logsQueryDefault };

  logs = signal<MonitoringLogList | undefined>(undefined);

  constructor() {
    this.listenInputChangeEndpoint();
  }

  private listenInputChangeEndpoint() {
    effect(() => {
      const endpoint = this.endpoint();
      if (!endpoint) return;
      this.logsQuery = { ...this.logsQueryDefault };
      this.apiMonitoringService.setEndpoint(endpoint);
      this.getLogs();
    });
  }

  private getLogs() {
    this.apiMonitoringService.getLogs(this.logsQuery).subscribe({
      next: (logs) => this.logs.set(logs),
      error: (error) => {
        // TODO handle error.
      },
    });
  }
}

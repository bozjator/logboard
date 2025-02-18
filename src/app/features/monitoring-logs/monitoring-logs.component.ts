import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ApiMonitoringService } from '../../shared/services/api-monitoring.service';
import { SortOrder } from '../../shared/models/sort-order.enum';
import { LogSortColumn, LogsQuery } from '../../shared/models/logs-query.model';
import { LogsTableComponent } from './components/logs-table/logs-table.component';
import { MonitoringLogList } from '../../shared/models/monitoring-log-list.dto';
import { MonitoringEndpointService } from '../../shared/services/monitoring-endpoint.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { PaginationQuery } from '../../shared/models/pagination.model';

@Component({
  selector: 'app-monitoring-logs',
  imports: [CommonModule, LogsTableComponent, PaginationComponent],
  template: `
    <app-logs-table [logs]="logs()" />
    <div class="mt-3">
      <app-pagination
        [pageNumber]="(logsQuery$ | async)?.pageNumber || 1"
        [pageItems]="(logsQuery$ | async)?.pageItems || 10"
        [totalCount]="logs()?.totalCount || 0"
        (onPageNumberChange)="onPageNumberChange($event)"
        (onPageItemsChange)="onPageItemsChange($event)"
      ></app-pagination>
    </div>
  `,
})
export class MonitoringLogsComponent {
  private destroyRef = inject(DestroyRef);
  private apiMonitoringService = inject(ApiMonitoringService);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  private logsQueryDefault: LogsQuery = {
    pageNumber: 1,
    pageItems: 10,
    sortOrder: SortOrder.asc,
    sortColumn: LogSortColumn.createdAt,
  };
  logsQuery$ = new BehaviorSubject<LogsQuery>({ ...this.logsQueryDefault });

  logs = signal<MonitoringLogList | undefined>(undefined);

  constructor() {
    this.onEndpointChange();
  }

  private onEndpointChange() {
    effect(() => {
      this.monitoringEndpointService.currentEndpoint();
      this.getLogs();
    });
  }

  private getLogs() {
    this.logsQuery$
      .pipe(
        switchMap((query) => this.apiMonitoringService.getLogs(query)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (logs) => this.logs.set(logs),
        error: (error) => {
          // TODO: Handle error.
        },
      });
  }

  private updatePagination(newData: Partial<PaginationQuery>) {
    const currentData = this.logsQuery$.value;
    this.logsQuery$.next({ ...currentData, ...newData });
  }

  onPageNumberChange(pageNumber: number): void {
    this.updatePagination({ pageNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageItemsChange(pageItems: number): void {
    this.updatePagination({ pageNumber: 1, pageItems });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

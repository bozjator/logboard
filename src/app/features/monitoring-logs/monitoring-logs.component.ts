import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, finalize, map, skip, switchMap, tap } from 'rxjs';
import { ApiMonitoringService } from '../../shared/services/api-monitoring.service';
import { SortOrder } from '../../shared/models/sort-order.enum';
import { LogSortColumn, LogsQuery } from '../../shared/models/logs-query.model';
import { LogsTableComponent } from './components/logs-table/logs-table.component';
import { MonitoringLogList } from '../../shared/models/monitoring-log-list.dto';
import { MonitoringEndpointService } from '../../shared/services/monitoring-endpoint.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { PaginationQuery } from '../../shared/models/pagination.model';
import { LogsFiltersComponent } from './components/logs-filters.component';
import { APP_STORAGE_NAMES } from '../../shared/models/app-storage-name.enum';
import { NotificationService } from '../../shared/components/notification/notification.service';
import { AlertType } from '../../shared/components/alert.component';
import { LoadingIndicatorComponent } from '../../shared/components/loading-indicator.component';

@Component({
  selector: 'app-monitoring-logs',
  imports: [
    CommonModule,
    LogsTableComponent,
    PaginationComponent,
    LogsFiltersComponent,
    LoadingIndicatorComponent,
  ],
  template: `
    <div class="m-4">
      <app-logs-filters [logsQuery$]="logsQuery$" />
    </div>

    @if (loadingData()) {
      <app-loading-indicator />
    }
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
export class MonitoringLogsComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private apiMonitoringService = inject(ApiMonitoringService);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  loadingData = signal(false);
  private mustResetPagination = false;

  private tablePageItemsStorage = {
    set: (pageItems: number) =>
      window.localStorage.setItem(
        APP_STORAGE_NAMES.tablePageItems,
        pageItems + '',
      ),
    get: () =>
      Number(
        window.localStorage.getItem(APP_STORAGE_NAMES.tablePageItems) ?? '10',
      ),
  };

  private paginationQueryDefault: PaginationQuery = {
    pageNumber: 1,
    pageItems: this.tablePageItemsStorage.get(),
    sortOrder: SortOrder.desc,
  };
  logsQuery$ = new BehaviorSubject<LogsQuery>({
    ...this.paginationQueryDefault,
    sortColumn: LogSortColumn.createdAt,
  });

  logs = signal<MonitoringLogList | undefined>(undefined);

  constructor() {
    this.onEndpointChange();
  }

  ngAfterViewInit(): void {
    this.subscribeToFiltersToGetLogs();
  }

  private onEndpointChange() {
    effect(() => {
      const currentEndpoint = this.monitoringEndpointService.currentEndpoint();
      if (!currentEndpoint) return;
      this.mustResetPagination = true;
    });
  }

  private subscribeToFiltersToGetLogs() {
    this.logsQuery$
      .pipe(
        map((query): LogsQuery => {
          if (this.mustResetPagination) {
            this.mustResetPagination = false;
            return {
              ...query,
              ...this.paginationQueryDefault,
            };
          } else return query;
        }),
        skip(1),
        tap(() => this.loadingData.set(true)),
        switchMap((query) =>
          this.apiMonitoringService
            .getLogs(query)
            .pipe(finalize(() => this.loadingData.set(false))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (logs) => this.logs.set(logs),
        error: (error) => {
          console.error(error);
          this.notificationService.show('Error getting logs.', {
            type: AlertType.red,
            title: 'Error',
          });
        },
      });
  }

  private updatePagination(newData: Partial<PaginationQuery>) {
    const currentData = this.logsQuery$.value;
    this.logsQuery$.next({ ...currentData, ...newData });
  }

  onPageNumberChange(pageNumber: number): void {
    this.updatePagination({ pageNumber });
  }

  onPageItemsChange(pageItems: number): void {
    this.updatePagination({ pageNumber: 1, pageItems });
    this.tablePageItemsStorage.set(pageItems);
    this.paginationQueryDefault.pageItems = pageItems;
  }
}

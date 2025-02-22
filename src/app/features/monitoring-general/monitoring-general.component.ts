import { Component, effect, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiMonitoringService } from '../../shared/services/api-monitoring.service';
import { MonitoringEndpointService } from '../../shared/services/monitoring-endpoint.service';
import { LogsTableComponent } from '../monitoring-logs/components/logs-table/logs-table.component';
import { TitleRightLineComponent } from '../../shared/components/title-right-line.component';
import { ObjectLogsTableComponent } from '../../shared/components/object-table/object-table.component';
import { MonitoringLoggerDBTransportError } from '../../shared/models/monitoring-logger-db-transport-error.dto';
import { CamelCaseToTitlePipe } from '../../shared/pipes/camel-case-to-title.pipe';
import { NotificationService } from '../../shared/components/notification/notification.service';
import { AlertType } from '../../shared/components/alert.component';
import { LoadingIndicatorComponent } from '../../shared/components/loading-indicator.component';

@Component({
  selector: 'app-monitoring-general',
  imports: [
    LogsTableComponent,
    TitleRightLineComponent,
    ObjectLogsTableComponent,
    CamelCaseToTitlePipe,
    LoadingIndicatorComponent,
  ],
  template: `
    @if (loadingData()) {
      <app-loading-indicator />
    }
    <div class="text-black dark:text-white">
      <app-title-right-line
        [title]="'Logger database transport error logs'"
        [textColor]="'text-gray-700 dark:text-gray-300'"
        [borderColor]="'border-gray-400'"
        [bgColor]="'bg-neutral-100 dark:bg-zinc-800'"
        [class]="'mt-4'"
      />
      @for (log of loggerDBTransportErrorLogs(); track $index) {
        <div class="m-2">
          <app-title-right-line
            [class]="'text-xs'"
            [title]="'Error and logger log'"
            [textColor]="'text-gray-700 dark:text-gray-300'"
            [borderColor]="'border-gray-400'"
            [bgColor]="'bg-neutral-100 dark:bg-zinc-800'"
          />
          <app-object-table [objects]="[log.error]" />
          <app-logs-table
            [logs]="{ totalCount: 1, result: [log.loggerRecord] }"
          />
          <div class="mx-2 my-6 border-t border-gray-400"></div>
        </div>
      }

      @for (item of otherData(); track $index) {
        <app-title-right-line
          [class]="'text-md'"
          [title]="item[0] | camelCaseToTitle"
          [textColor]="'text-gray-700 dark:text-gray-300'"
          [borderColor]="'border-gray-400'"
          [bgColor]="'bg-neutral-100 dark:bg-zinc-800'"
        />
        @if (typeof item[1][0] === 'object') {
          <app-object-table [objects]="item[1]" />
        } @else {
          <div class="ml-6">
            {{ JSON.stringify(item[1]) }}
          </div>
        }
      }
    </div>
  `,
})
export class MonitoringGeneralComponent {
  private notificationService = inject(NotificationService);
  private apiMonitoringService = inject(ApiMonitoringService);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  JSON = JSON;
  loggerDBTransportErrorLogs = signal<MonitoringLoggerDBTransportError[]>([]);
  otherData = signal<(string[] | [string, any])[]>([]);
  loadingData = signal(false);

  constructor() {
    this.onEndpointChange();
  }

  private onEndpointChange() {
    effect(() => {
      const currentEndpoint = this.monitoringEndpointService.currentEndpoint();
      if (!currentEndpoint) return;
      this.getGeneralData();
    });
  }

  private getGeneralData() {
    this.loadingData.set(true);
    this.apiMonitoringService
      .getGeneral()
      .pipe(finalize(() => this.loadingData.set(false)))
      .subscribe({
        next: (infoData) => {
          this.loggerDBTransportErrorLogs.set(
            infoData.loggerDBTransportErrorLogs,
          );
          const { loggerDBTransportErrorLogs, ...otherData } = infoData;
          this.otherData.set(Object.entries(otherData));
        },
        error: (error) => {
          console.error(error);
          this.notificationService.show('Error getting general logs.', {
            type: AlertType.red,
            title: 'Error',
          });
        },
      });
  }
}

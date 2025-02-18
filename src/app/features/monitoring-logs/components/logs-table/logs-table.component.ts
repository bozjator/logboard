import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringLogList } from '../../../../shared/models/monitoring-log-list.dto';
import { CamelCaseToTitlePipe } from '../../../../shared/pipes/camel-case-to-title.pipe';

@Component({
  selector: 'app-logs-table',
  imports: [CommonModule, CamelCaseToTitlePipe],
  templateUrl: './logs-table.component.html',
})
export class LogsTableComponent {
  logs = input<MonitoringLogList>();
  logsItems = computed(() =>
    this.logs()?.result.map((item) =>
      Object.entries(item).map((item) => {
        const itemValue = item[1];
        if (typeof itemValue === 'object')
          return [item[0], JSON.stringify(itemValue)];
        else return item;
      }),
    ),
  );
}

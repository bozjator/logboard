import {
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CamelCaseToTitlePipe } from '../../../shared/pipes/camel-case-to-title.pipe';
import { LogsQuery } from '../../../shared/models/logs-query.model';
import { ApiMonitoringService } from '../../../shared/services/api-monitoring.service';
import { MonitoringLogListFilters } from '../../../shared/models/monitoring-log-list-filters.dto';
import { MonitoringEndpointService } from '../../../shared/services/monitoring-endpoint.service';
import { DropdownItem } from '../../../shared/models/dropdown-item.model';
import { DropdownComponent } from '../../../shared/components/dropdown.component';

interface FilterDropdown {
  label: string;
  items: DropdownItem<string | number>[];
  selectedItem: WritableSignal<DropdownItem<string | number> | undefined>;
}

@Component({
  selector: 'app-logs-filters',
  imports: [CommonModule, CamelCaseToTitlePipe, DropdownComponent],
  template: `
    <div class="flex flex-wrap gap-4 text-gray-800 dark:text-gray-50">
      @for (filter of filtersDropdowns(); track $index) {
        <div class="flex min-w-sm flex-col md:min-w-lg">
          <span class="mb-2 text-sm font-medium">
            {{ filter.label | camelCaseToTitle }}
          </span>

          <div class="flex items-center gap-1">
            <app-dropdown
              class="w-full"
              [items]="filter.items"
              [(selectedItem)]="filter.selectedItem"
            />
            @if (filter.selectedItem()) {
              <button
                (click)="filter.selectedItem.set(undefined)"
                class="cursor-pointer rounded-full p-1 text-sm font-semibold shadow-xs hover:bg-red-100"
              >
                <svg height="16px" viewBox="0 -960 960 960" width="16px">
                  <path
                    class="fill-red-400"
                    d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                  />
                </svg>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class LogsFiltersComponent {
  private apiMonitoringService = inject(ApiMonitoringService);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  logsQuery$ = input.required<BehaviorSubject<LogsQuery>>();

  filtersDropdowns = signal<FilterDropdown[]>([]);

  constructor() {
    this.getFiltersOnEndpointChange();
    this.handleFiltersChange();
  }

  private getFiltersOnEndpointChange() {
    effect(() => {
      const currentEndpoint = this.monitoringEndpointService.currentEndpoint();
      if (!currentEndpoint) return;
      this.getLogFiltersValues();
    });
  }

  private handleFiltersChange() {
    effect(() => {
      const query: LogsQuery | any = { ...this.logsQuery$().value };
      this.filtersDropdowns().forEach((filter) => {
        query[filter.label] = filter.selectedItem()?.value;
      });
      this.logsQuery$().next(query);
    });
  }

  private getLogFiltersValues() {
    this.apiMonitoringService.getLogsFilters().subscribe({
      next: (filters) => this.prepareFilters(filters),
      error: (error) => {
        console.error(error);
        // TODO handle error.
      },
    });
  }

  private prepareFilters(filters: MonitoringLogListFilters) {
    const filterDropdownItems = Object.entries(filters).map((filter) => {
      const dropdownItems: DropdownItem<string | number>[] = filter[1].map(
        (value: string | number): DropdownItem<string | number> => ({
          label: String(value),
          value: value,
        }),
      );
      return {
        label: filter[0],
        items: dropdownItems,
        selectedItem: signal(undefined),
      };
    });

    this.filtersDropdowns.set(filterDropdownItems);
  }
}

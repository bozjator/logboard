import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { LayoutService } from '../shared/services/layout.service';
import { DialogService } from '../shared/dialogs/base/dialog.service';
import { MonitoringEndpointDialog } from '../shared/dialogs/monitoring-endpoint.dialog';
import { DropdownItem } from '../shared/models/dropdown-item.model';
import { MonitoringEndpoint } from '../shared/models/monitoring-endpoint.model';
import { MonitoringEndpointService } from '../shared/services/monitoring-endpoint.service';
import { DropdownComponent } from '../shared/components/dropdown.component';
import { ApiMonitoringService } from '../shared/services/api-monitoring.service';
import { DialogDataMonitoringEndpoint } from '../shared/dialogs/models/dialog-data-monitoring-endpoint.model';

@Component({
  selector: 'app-main-toolbar',
  imports: [DropdownComponent],
  template: `
    <div class="absolute top-4 right-4">
      <div class="flex space-x-2">
        <app-dropdown
          [items]="dropdownItemsMonitorEndpoints()"
          [(selectedItem)]="selectedDropdownItemMonitorEndpoint"
        />

        <button
          (click)="openDialogEditMonitoringEndpoint()"
          class="cursor-pointer rounded-md bg-blue-600/80 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500"
        >
          <svg
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path
              d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
            />
          </svg>
        </button>

        <button
          (click)="openDialogAddMonitoringEndpoint()"
          class="cursor-pointer rounded-md bg-blue-600/80 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500"
        >
          <svg
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path
              d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            />
          </svg>
        </button>

        <button
          type="button"
          class="cursor-pointer rounded-md bg-blue-600/80 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500"
          (click)="layoutService.toggleThemeMode()"
        >
          @if (layoutService.isDarkMode()) {
            <svg
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"
              />
            </svg>
          } @else {
            <svg
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"
              />
            </svg>
          }
        </button>
      </div>
    </div>
  `,
})
export class MainToolbarComponent {
  private apiMonitoringService = inject(ApiMonitoringService);
  private monitoringEndpointService = inject(MonitoringEndpointService);
  private dialogService = inject(DialogService);
  layoutService = inject(LayoutService);

  dropdownItemsMonitorEndpoints: Signal<DropdownItem<MonitoringEndpoint>[]> =
    computed(() =>
      (this.monitoringEndpointService.monitoringEndpoints() ?? []).map(
        (endpoint) => ({
          label: endpoint.name,
          value: endpoint,
        }),
      ),
    );

  selectedDropdownItemMonitorEndpoint: WritableSignal<
    DropdownItem<MonitoringEndpoint> | undefined
  > = signal(undefined);

  constructor() {
    this.setupEndpointDropdownSelection();
  }

  private setupEndpointDropdownSelection() {
    // Set dropdown selection to first item when dropdown items change.
    effect(() => {
      const dropdownItem = this.dropdownItemsMonitorEndpoints()[0];
      this.selectedDropdownItemMonitorEndpoint.set(dropdownItem);
    });

    // Set current endpoint when dropdown items is selected.
    effect(() => {
      const endpoint = this.selectedDropdownItemMonitorEndpoint()?.value;
      if (!endpoint) return;
      this.apiMonitoringService.setEndpoint(endpoint);
      this.monitoringEndpointService.currentEndpoint.set(endpoint);
    });
  }

  openDialogAddMonitoringEndpoint() {
    this.dialogService.open(MonitoringEndpointDialog);
  }

  openDialogEditMonitoringEndpoint() {
    this.dialogService.open<DialogDataMonitoringEndpoint>(
      MonitoringEndpointDialog,
      { isModeEditCurrent: true },
    );
  }
}

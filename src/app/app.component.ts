import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './shared/dialogs/base/dialog.service';
import { AddMonitoringEndpointDialog } from './shared/dialogs/add-monitoring-endpoint.dialog';
import { LayoutService } from './shared/services/layout.service';
import { DropdownComponent } from './shared/components/dropdown.component';
import { DropdownItem } from './shared/models/dropdown-item.model';
import { MonitoringEndpoint } from './shared/models/monitoring-endpoint.model';
import { MonitoringEndpointService } from './shared/services/monitoring-endpoint.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private monitoringEndpointService = inject(MonitoringEndpointService);
  private dialogService = inject(DialogService);
  layoutService = inject(LayoutService);

  dropdownItemsMonitorEndpoints: DropdownItem<MonitoringEndpoint>[] =
    this.monitoringEndpointService.monitoringEndpoints().map((endpoint) => ({
      label: `${endpoint.name} - ${endpoint.url}`,
      value: endpoint,
    }));
  selectedDropdownItemMonitorEndpoint = signal(
    this.dropdownItemsMonitorEndpoints[0],
  );

  openAddMonitoringEndpointDialog() {
    this.dialogService.open(AddMonitoringEndpointDialog);
  }
}

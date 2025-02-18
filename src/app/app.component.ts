import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainToolbarComponent } from './features/main-toolbar.component';
import { DropdownComponent } from './shared/components/dropdown.component';
import { DropdownItem } from './shared/models/dropdown-item.model';
import { MonitoringEndpoint } from './shared/models/monitoring-endpoint.model';
import { MonitoringEndpointService } from './shared/services/monitoring-endpoint.service';
import { MonitoringLogsComponent } from './features/monitoring-logs/monitoring-logs.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DropdownComponent,
    MainToolbarComponent,
    MonitoringLogsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private monitoringEndpointService = inject(MonitoringEndpointService);

  dropdownItemsMonitorEndpoints: DropdownItem<MonitoringEndpoint>[] =
    this.monitoringEndpointService.monitoringEndpoints().map((endpoint) => ({
      label: `${endpoint.name} - ${endpoint.url}`,
      value: endpoint,
    }));
  selectedDropdownItemMonitorEndpoint: WritableSignal<
    DropdownItem<MonitoringEndpoint> | undefined
  > = signal(this.dropdownItemsMonitorEndpoints[0]);
}

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './shared/dialogs/base/dialog.service';
import { AddMonitoringEndpointDialog } from './shared/dialogs/add-monitoring-endpoint.dialog';
import { LayoutService } from './shared/services/layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private dialogService = inject(DialogService);
  layoutService = inject(LayoutService);

  openAddMonitoringEndpointDialog() {
    this.dialogService.open(AddMonitoringEndpointDialog);
  }
}

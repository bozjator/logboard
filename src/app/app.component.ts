import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainToolbarComponent } from './features/main-toolbar.component';
import { MonitoringLogsComponent } from './features/monitoring-logs/monitoring-logs.component';
import { MonitoringGeneralComponent } from './features/monitoring-general/monitoring-general.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MainToolbarComponent,
    MonitoringLogsComponent,
    MonitoringGeneralComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  view = {
    logger: 0,
    general: 1,
  };
  viewIndex = signal(this.view.logger);
}

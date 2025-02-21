import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainToolbarComponent } from './features/main-toolbar.component';
import { MonitoringLogsComponent } from './features/monitoring-logs/monitoring-logs.component';
import { MonitoringGeneralComponent } from './features/monitoring-general/monitoring-general.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MainToolbarComponent,
    MonitoringLogsComponent,
    MonitoringGeneralComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}

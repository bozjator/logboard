import { effect, Injectable, signal } from '@angular/core';
import { APP_STORAGE_NAMES } from '../models/app-storage-name.enum';
import { MonitoringEndpoint } from '../models/monitoring-endpoint.model';

@Injectable({ providedIn: 'root' })
export class MonitoringEndpointService {
  readonly monitoringEndpoints = signal<MonitoringEndpoint[]>([]);
  readonly currentEndpoint = signal<MonitoringEndpoint | undefined>(undefined);

  constructor() {
    this.initMonitoringPoints();
    this.setCurrentEndpoint();
    this.setupEffects();
  }

  private setupEffects() {
    // Set monitoringEndpoints signal effect.
    effect(() => {
      window.localStorage.setItem(
        APP_STORAGE_NAMES.monitoringEndpoints,
        JSON.stringify(this.monitoringEndpoints()),
      );
    });
  }

  private initMonitoringPoints() {
    const endpoints: MonitoringEndpoint[] = JSON.parse(
      window.localStorage.getItem(APP_STORAGE_NAMES.monitoringEndpoints) ??
        '[]',
    );
    this.monitoringEndpoints.set(endpoints);
  }

  private setCurrentEndpoint() {
    this.currentEndpoint.set(this.monitoringEndpoints()[0]);
  }
}

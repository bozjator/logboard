import { effect, inject, Injectable, signal } from '@angular/core';
import { APP_STORAGE_NAMES } from '../models/app-storage-name.enum';
import { MonitoringEndpoint } from '../models/monitoring-endpoint.model';
import { EncryptionService } from './encryption.service';

@Injectable({ providedIn: 'root' })
export class MonitoringEndpointService {
  private encryptionService = inject(EncryptionService);

  readonly monitoringEndpoints = signal<MonitoringEndpoint[] | undefined>(
    undefined,
  );
  readonly currentEndpoint = signal<MonitoringEndpoint | undefined>(undefined);

  private password = 'string1234'; // TODO get it from user.

  constructor() {
    this.readEndpointsFromStorage();
    this.listenToStoreEndpoints();
  }

  private listenToStoreEndpoints() {
    effect(async () => {
      const endpoints = this.monitoringEndpoints();
      if (!endpoints) return;
      const endpointsAsString = JSON.stringify(endpoints);
      const encryptedData = await this.encryptionService.encryptData(
        endpointsAsString,
        this.password,
      );
      window.localStorage.setItem(
        APP_STORAGE_NAMES.monitoringEndpoints,
        JSON.stringify(encryptedData),
      );
    });
  }

  private async readEndpointsFromStorage() {
    const encryptedDataString = window.localStorage.getItem(
      APP_STORAGE_NAMES.monitoringEndpoints,
    );
    if (!encryptedDataString) return;

    const encryptedData = JSON.parse(encryptedDataString);

    try {
      const decryptedData: string = await this.encryptionService.decryptData(
        encryptedData,
        this.password,
      );
      const endpoints: MonitoringEndpoint[] = JSON.parse(decryptedData ?? '[]');
      this.monitoringEndpoints.set(endpoints);
    } catch (error) {
      console.error(error);
      // TODO handle decryption failure - ask again for password or offer to clear data.
    }
  }

  removeCurrentEndpoint(): boolean {
    const currentEndpoint = this.currentEndpoint();
    if (!currentEndpoint) return false;

    const endpointsCount = (this.monitoringEndpoints() ?? []).length;
    const filteredEndpoints = (this.monitoringEndpoints() ?? []).filter(
      (endpoint) =>
        !(
          endpoint.name === currentEndpoint.name &&
          endpoint.url === currentEndpoint.url
        ),
    );

    this.monitoringEndpoints.set(filteredEndpoints);
    this.currentEndpoint.set(filteredEndpoints[0]);

    return endpointsCount != this.monitoringEndpoints()?.length;
  }
}

import { Component, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from './base/dialog.component';
import { MonitoringEndpoint } from '../models/monitoring-endpoint.model';
import { MonitoringEndpointService } from '../services/monitoring-endpoint.service';
import { DialogDataMonitoringEndpoint } from './models/dialog-data-monitoring-endpoint.model';
import { DialogService } from './base/dialog.service';
import { DialogDataConfirmation } from './models/dialog-data-confirmation.model';
import { ConfirmationDialogComponent } from './confirmation.dialog';

interface MonitoringEndpointForm {
  name: FormControl<string | null>;
  url: FormControl<string | null>;
  key: FormControl<string | null>;
  keyHeaderName: FormControl<string | null>;
}

@Component({
  selector: 'app-dialog-monitoring-endpoint',
  imports: [CommonModule, ReactiveFormsModule, DialogComponent],
  template: `
    <ng-template
      #inputField
      let-label="label"
      let-formGroup="formGroup"
      let-formControlName="formControlName"
    >
      <div class="my-4">
        <label
          class="block text-sm/6 font-medium text-gray-900 dark:text-gray-50"
          >{{ label }}</label
        >
        <div class="mt-2 min-w-xs sm:min-w-xl" [formGroup]="formGroup">
          <input
            [formControlName]="formControlName"
            type="text"
            required
            class="block w-full rounded-md border-0 bg-gray-100 px-1.5 py-1.5 text-center text-sm text-gray-900 ring-1 shadow-sm ring-gray-300 ring-inset placeholder:text-gray-400 hover:bg-gray-50 sm:leading-6"
            [ngClass]="{
              'ring-red-400':
                monitoringEndpointForm.get(formControlName)?.dirty &&
                monitoringEndpointForm.get(formControlName)?.errors,
            }"
          />
        </div>
      </div>
    </ng-template>
    <app-dialog [title]="'Monitoring endpoint'">
      <div class="mb-8 dark:text-gray-100">
        <form [formGroup]="monitoringEndpointForm">
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'Name',
              formControlName: 'name',
              formGroup: monitoringEndpointForm,
            }"
          />
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'API base URL',
              formControlName: 'url',
              formGroup: monitoringEndpointForm,
            }"
          />
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'Secret key',
              formControlName: 'key',
              formGroup: monitoringEndpointForm,
            }"
          />
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'Secret key header name',
              formControlName: 'keyHeaderName',
              formGroup: monitoringEndpointForm,
            }"
          />
        </form>
      </div>
      <ng-container footer-start>
        <button
          (click)="openDialogDeleteEndpoint()"
          class="cursor-pointer rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500"
        >
          <svg
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
            />
          </svg>
        </button>
      </ng-container>
      <ng-container footer>
        @if (errorMessage()) {
          <div class="flex items-center text-red-700">{{ errorMessage() }}</div>
        }

        <button type="button" class="app-btn-sec" (click)="dialogClose.emit()">
          Cancel
        </button>
        <button
          type="button"
          class="app-btn"
          (click)="
            dialogData().isModeEditCurrent
              ? updateMonitoringEndpoint()
              : addMonitoringEndpoint()
          "
        >
          @if (dialogData().isModeEditCurrent) {
            Update
          } @else {
            Add
          }
        </button>
      </ng-container>
    </app-dialog>
  `,
})
export class MonitoringEndpointDialog implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogService = inject(DialogService);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  dialogData = signal<DialogDataMonitoringEndpoint>({
    isModeEditCurrent: false,
  });
  dialogClose = output<void>();

  monitoringEndpointForm!: FormGroup<MonitoringEndpointForm>;
  errorMessage = signal<string | undefined>(undefined);

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    const formGroup = {
      name: ['', [Validators.required]],
      url: ['', [Validators.required]],
      key: ['', [Validators.required]],
      keyHeaderName: ['x-api-monitoring-secret', [Validators.required]],
    };

    const endpoint = this.monitoringEndpointService.currentEndpoint();
    if (this.dialogData().isModeEditCurrent && endpoint) {
      formGroup.name[0] = endpoint.name;
      formGroup.url[0] = endpoint.url;
      formGroup.key[0] = endpoint.key;
      formGroup.keyHeaderName[0] = endpoint.keyHeaderName;
    }

    this.monitoringEndpointForm = this.formBuilder.group(formGroup);
  }

  private doesEndpointExists(
    existingEndpoints: MonitoringEndpoint[],
    newEndpoint: MonitoringEndpoint,
  ): boolean {
    const existingEndpoint = existingEndpoints.find(
      (endpoint) =>
        endpoint.name === newEndpoint.name || endpoint.url === newEndpoint.url,
    );
    return !!existingEndpoint;
  }

  addMonitoringEndpoint() {
    this.errorMessage.set(undefined);
    if (!this.monitoringEndpointForm.valid) return;

    const newEndpoint = this.monitoringEndpointForm.value as MonitoringEndpoint;
    const existingEndpoints =
      this.monitoringEndpointService.monitoringEndpoints() ?? [];

    // Check if endpoint, with same data, already exists.
    const endpointExists = this.doesEndpointExists(
      existingEndpoints,
      newEndpoint,
    );
    if (endpointExists) {
      this.errorMessage.set('Endpoint with given Name or URL already exists.');
      return;
    }

    // Add new endpoint.
    const endpoints = [...existingEndpoints, newEndpoint];
    this.monitoringEndpointService.monitoringEndpoints.set(endpoints);

    this.dialogClose.emit();
  }

  updateMonitoringEndpoint() {
    this.errorMessage.set(undefined);
    if (!this.monitoringEndpointForm.valid) return;

    const updatedEndpoint = this.monitoringEndpointForm
      .value as MonitoringEndpoint;
    const currentEndpoint = this.monitoringEndpointService.currentEndpoint();
    const existingEndpoints =
      this.monitoringEndpointService.monitoringEndpoints() ?? [];

    if (!currentEndpoint) return;

    // Check if endpoint, with same data, already exists.
    const existingEndpointsWithoutCurrent = existingEndpoints.filter(
      (endpoint) => endpoint.name !== currentEndpoint.name,
    );
    const endpointExists = this.doesEndpointExists(
      existingEndpointsWithoutCurrent,
      updatedEndpoint,
    );
    if (endpointExists) {
      this.errorMessage.set('Endpoint with given Name or URL already exists.');
      return;
    }

    // Update endpoint.
    const endpointInUpdateIndex = existingEndpoints.findIndex(
      (endpoint) => endpoint.name === currentEndpoint.name,
    );
    if (endpointInUpdateIndex === -1) {
      this.errorMessage.set('Did not found endpoint to update.');
      return;
    }
    const endpoints = [...existingEndpoints];
    endpoints.splice(endpointInUpdateIndex, 1, updatedEndpoint);
    this.monitoringEndpointService.monitoringEndpoints.set(endpoints);

    this.dialogClose.emit();
  }

  openDialogDeleteEndpoint() {
    this.dialogClose.emit();
    const currentEndpoint = this.monitoringEndpointService.currentEndpoint();
    this.dialogService
      .open<DialogDataConfirmation, boolean>(ConfirmationDialogComponent, {
        title: 'Delete endpoint',
        content: `Are you sure you want to delete ${currentEndpoint?.name} endpoint?`,
      })
      .subscribe((isOkToDelete) => {
        if (isOkToDelete)
          this.monitoringEndpointService.removeCurrentEndpoint();
      });
  }
}

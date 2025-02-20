import {
  Component,
  ChangeDetectionStrategy,
  output,
  inject,
  signal,
  OnInit,
} from '@angular/core';
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
      <ng-container footer>
        @if (errorMessage()) {
          <div class="flex items-center text-red-700">{{ errorMessage() }}</div>
        }
        <button
          type="button"
          class="cursor-pointer rounded-md bg-gray-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          (click)="dialogClose.emit()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
    const endpointExists = this.doesEndpointExists(
      existingEndpoints,
      updatedEndpoint,
    );
    if (endpointExists) {
      this.errorMessage.set('Endpoint with given Name or URL already exists.');
      return;
    }

    // Update endpoint.
    const endpointInUpdateIndex = existingEndpoints.findIndex(
      (endpoint) =>
        endpoint.name === currentEndpoint.name ||
        endpoint.url === currentEndpoint.url,
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
}

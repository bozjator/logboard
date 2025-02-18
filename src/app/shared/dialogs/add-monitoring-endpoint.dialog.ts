import {
  Component,
  ChangeDetectionStrategy,
  output,
  inject,
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

interface MonitoringEndpointForm {
  name: FormControl<string | null>;
  url: FormControl<string | null>;
  key: FormControl<string | null>;
}

@Component({
  selector: 'app-add-monitoring-endpoint-dialog',
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
    <app-dialog [title]="'Add monitoring endpoint'">
      <div class="mb-8 dark:text-gray-100">
        <form [formGroup]="monitoringEndpointForm">
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'Name',
              formControlName: 'name',
              formGroup: monitoringEndpointForm,
            }"
          ></ng-template>
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'URL',
              formControlName: 'url',
              formGroup: monitoringEndpointForm,
            }"
          ></ng-template>
          <ng-template
            [ngTemplateOutlet]="inputField"
            [ngTemplateOutletContext]="{
              label: 'Secret key',
              formControlName: 'key',
              formGroup: monitoringEndpointForm,
            }"
          ></ng-template>
        </form>
      </div>
      <ng-container footer>
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
          (click)="addMonitoringEndpoint()"
        >
          Add
        </button>
      </ng-container>
    </app-dialog>
  `,
})
export class AddMonitoringEndpointDialog {
  private formBuilder = inject(FormBuilder);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  dialogClose = output<void>();

  monitoringEndpointForm!: FormGroup<MonitoringEndpointForm>;

  constructor() {
    this.setupForm();
  }

  private setupForm() {
    this.monitoringEndpointForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      url: ['', [Validators.required]],
      key: ['', [Validators.required]],
    });
  }

  addMonitoringEndpoint() {
    if (!this.monitoringEndpointForm.valid) return;
    const newEndpoint = this.monitoringEndpointForm.value as MonitoringEndpoint;
    const endpoints = [
      ...this.monitoringEndpointService.monitoringEndpoints(),
      newEndpoint,
    ];
    this.monitoringEndpointService.monitoringEndpoints.set(endpoints);
    this.dialogClose.emit();
  }
}

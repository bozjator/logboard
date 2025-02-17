import {
  Component,
  ChangeDetectionStrategy,
  signal,
  effect,
  output,
} from '@angular/core';
import { DialogComponent } from './base/dialog.component';

@Component({
  selector: 'app-add-monitoring-endpoint-dialog',
  imports: [DialogComponent],
  template: `
    <app-dialog [title]="'Add monitoring endpoint'">
      <div class="dark:text-gray-100">
        Name
        <br />
        URL
        <br />
        Key
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMonitoringEndpointDialog {
  dialogClose = output<void>();

  addMonitoringEndpoint() {
    console.log('TODO addMonitoringEndpoint');
  }
}

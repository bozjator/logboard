import { Component, output, signal } from '@angular/core';
import { DialogComponent } from './base/dialog.component';
import { DialogDataConfirmation } from './models/dialog-data-confirmation.model';

@Component({
  selector: 'app-dialog-confirmation',
  template: `
    <app-dialog [title]="dialogData().title">
      <div class="dark:text-gray-100">
        {{ dialogData().content }}
      </div>
      <ng-container footer>
        <button class="app-btn-sec" (click)="dialogClose.emit(false)">
          Cancel
        </button>
        <button class="app-btn" (click)="dialogClose.emit(true)">OK</button>
      </ng-container>
    </app-dialog>
  `,
  imports: [DialogComponent],
})
export class ConfirmationDialogComponent {
  dialogData = signal<DialogDataConfirmation>({
    title: 'Confirmation',
    content: 'Are you sure?',
  });
  dialogClose = output<boolean>();
}

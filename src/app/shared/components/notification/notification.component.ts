import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  viewChild,
} from '@angular/core';
import { AlertComponent, AlertType } from '../alert.component';

@Component({
  selector: 'app-notification',
  template: `
    <div
      #notificationDiv
      class="notification flex flex-col items-center lg:animate-bounce"
    >
      <div class="flex w-full items-center justify-between">
        <span class="pl-1 text-center text-sm">{{ title }}</span>
        <span
          (click)="close.emit()"
          class="cursor-pointer rounded-full hover:bg-amber-100/20"
        >
          <svg
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            fill="#e8eaed"
          >
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>
        </span>
      </div>
      <app-alert
        visible
        [showEdgeBorders]="false"
        [message]="message"
        [type]="type"
        [class]="'p-6'"
        class="w-full"
      />
    </div>
  `,
  imports: [AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  title: string = 'Info';
  message: string = '';
  type: AlertType = AlertType.gray;
  readonly close = output<void>();

  readonly notificationDiv =
    viewChild.required<ElementRef<HTMLDivElement>>('notificationDiv');

  removeAnimation() {
    this.notificationDiv().nativeElement.classList.remove('lg:animate-bounce');
  }
}

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export enum AlertType {
  /** Error */
  red = 'red',

  /** Warning */
  yellow = 'yellow',

  /** Information */
  blue = 'blue',

  /** Success */
  green = 'green',

  /** Neutral or System message */
  gray = 'gray',
}

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div
        class="flex items-center justify-center rounded-sm text-center text-sm {{
          class()
        }}"
        [ngClass]="{
          'bg-green-200 text-green-700': type() === alertTypeEnum.green,
          'bg-sky-200 text-sky-700': type() === alertTypeEnum.blue,
          'bg-stone-200 text-stone-700': type() === alertTypeEnum.gray,
          'bg-yellow-50 text-yellow-700': type() === alertTypeEnum.yellow,
          'bg-red-50 text-red-700': type() === alertTypeEnum.red,
          'border-r-4 border-l-4': showEdgeBorders(),
          'border-green-400':
            showEdgeBorders() && type() === alertTypeEnum.green,
          'border-sky-400': showEdgeBorders() && type() === alertTypeEnum.blue,
          'border-stone-400':
            showEdgeBorders() && type() === alertTypeEnum.gray,
          'border-yellow-400':
            showEdgeBorders() && type() === alertTypeEnum.yellow,
          'border-red-400': showEdgeBorders() && type() === alertTypeEnum.red,
        }"
      >
        {{ message() }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  alertTypeEnum: any = AlertType;

  readonly visible = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly showEdgeBorders = input<boolean>(true);
  readonly type = input<AlertType | string>(AlertType.gray);
  readonly message = input<string>('');
  readonly class = input<string>('p-2');
}

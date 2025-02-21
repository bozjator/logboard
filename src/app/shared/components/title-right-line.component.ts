import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title-right-line',
  template: `
    <div class="relative mx-2 {{ class() }}">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t {{ borderColor() }}"></div>
      </div>
      <div class="relative flex justify-start">
        <span
          class="pr-3 font-semibold leading-6
          {{ bgColor() }} {{ textColor() }}"
        >
          {{ title() }}
        </span>
      </div>
    </div>
  `,
})
export class TitleRightLineComponent {
  readonly class = input<string>('');
  readonly title = input<string>('');
  readonly textColor = input<string>('text-gray-600  dark:text-gray-200');
  readonly borderColor = input<string>('border-gray-600 dark:border-gray-200');
  readonly bgColor = input<string>('bg-zinc-100 dark:bg-zinc-500');
}

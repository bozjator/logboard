import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  imports: [],
  template: `
    <div class="flex items-center space-x-2 {{ class() }}">
      <span class="text-blue-500">Loading</span>
      <div class="flex space-x-1">
        <div class="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
        <div
          class="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-150"
        ></div>
        <div
          class="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-300"
        ></div>
      </div>
    </div>
  `,
})
export class LoadingIndicatorComponent {
  readonly class = input<string>('m-2');
}

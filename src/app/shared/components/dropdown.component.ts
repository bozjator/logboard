import { Component, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownItem } from '../models/dropdown-item.model';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  template: `
    <div class="relative inline-block w-full text-left">
      <div>
        <button
          type="button"
          class="inline-flex w-full cursor-pointer items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 ring-1 shadow-sm ring-gray-300 ring-inset hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300 hover:dark:bg-gray-500"
          (click)="toggleDropdown()"
        >
          <span class="mx-auto truncate">{{ selectedItem()?.label }}</span>
          <svg
            class="ml-2 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      @if (dropdownOpen()) {
        <!--
          Dropdown menu, show/hide based on menu state.

          Entering: "transition ease-out duration-100"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
          Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
        -->
        <div
          class="absolute z-10 mt-0.5 min-w-[min(100%,theme(width.64))] origin-top-right rounded-md bg-white ring-1 shadow-lg ring-gray-300 ring-inset placeholder:text-gray-400"
          (mouseleave)="toggleDropdown()"
        >
          <div class="py-1" role="none">
            @for (item of items(); track item.value) {
              <div
                class="mx-0.5 block cursor-pointer px-4 py-2 text-sm"
                [ngClass]="{
                  'text-gray-700 hover:bg-gray-100': !item.disabled,
                  'text-gray-500': item.disabled,
                }"
                (click)="item.disabled ? null : itemSelected(item)"
              >
                {{ item.label }}
                @if (item.disabled) {
                  <small>{{ item.disabledMsg }}</small>
                }
              </div>
            }
            <ng-content></ng-content>
          </div>
        </div>
      }
    </div>
  `,
})
export class DropdownComponent<T> {
  readonly items = input.required<DropdownItem<T>[]>();
  readonly selectedItem = model.required<DropdownItem<T> | undefined>();

  dropdownOpen = signal(false);

  toggleDropdown(): void {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  itemSelected(item: DropdownItem<T>) {
    this.selectedItem.set(item);
    this.dropdownOpen.set(false);
  }
}

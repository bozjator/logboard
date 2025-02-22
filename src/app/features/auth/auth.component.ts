import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { APP_STORAGE_NAMES } from '../../shared/models/app-storage-name.enum';
import { AlertComponent } from '../../shared/components/alert.component';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, AlertComponent],
  template: `
    <div
      class="flex flex-col justify-center bg-zinc-300 px-6 py-12 pb-8 shadow-lg sm:mx-auto sm:max-w-md lg:max-w-lg lg:px-8"
    >
      <div
        class="mx-auto rounded-xl bg-gray-800 px-28 py-5 font-bold text-amber-50"
      >
        LOGBOARD
      </div>

      <div class="mt-8">
        <div class="my-4">
          <label
            class="block text-sm/6 font-medium text-gray-900 dark:text-gray-50"
            >Password</label
          >
          <input
            [formControl]="formControl.password"
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            tabindex="2"
            class="w-full rounded-md border-0 bg-gray-100 px-1.5 py-1.5 text-center text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset placeholder:text-gray-400 hover:bg-gray-50 sm:text-sm sm:leading-6"
            (keyup.enter)="login()"
          />
        </div>
        <button
          class="app-btn"
          (click)="login()"
          [disabled]="!formControl.password.valid"
        >
          Login
        </button>
      </div>
      @let errorMsg = errorMessage();
      @if (errorMsg) {
        <app-alert
          visible
          [message]="errorMsg"
          [type]="'red'"
          [class]="'my-2 p-2'"
        />
        @if (hasExistingEncryptedData()) {
          <div class="">
            <button
              class="app-btn-sec float-end bg-amber-400"
              (click)="clearExistingData()"
            >
              Clear existing data
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class AuthComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  hasExistingEncryptedData = signal(false);
  errorMessage = signal<string | undefined>(undefined);

  formControl = {
    password: new FormControl('', [Validators.required]),
  };

  constructor() {
    this.setHasEncryptedData();
  }

  private setHasEncryptedData() {
    const encryptedDataString = window.localStorage.getItem(
      APP_STORAGE_NAMES.monitoringEndpoints,
    );
    if (encryptedDataString && encryptedDataString.length > 0)
      this.hasExistingEncryptedData.set(true);
  }

  async login() {
    const password = this.formControl.password.value;
    if (!(password && password.length > 0)) return;

    // Check if password is ok to decrypt existing data.
    if (this.hasExistingEncryptedData()) {
      const decryptSuccess =
        await this.authService.canDecryptEndpoints(password);
      if (!decryptSuccess) {
        this.errorMessage.set('Wrong password to decrypt existing data.');
        return;
      }
    }

    this.authService.password = password;
    this.router.navigateByUrl('/board');
  }

  clearExistingData() {
    // TODO ask for confirmation then delete existing endpoints.
    console.log('🚀 ~ AuthComponent ~ clearExistingData: TODO');
  }
}

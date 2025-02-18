import { effect, Injectable, signal } from '@angular/core';
import { APP_STORAGE_NAMES } from '../models/app-storage-name.enum';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly isDarkMode = signal(false);

  constructor() {
    this.initIsDarkMode();
    this.setupEffects();
  }

  private setupEffects() {
    // Set isDarkMode signal effect.
    effect(() => {
      window.localStorage.setItem(
        APP_STORAGE_NAMES.isDarkMode,
        JSON.stringify(this.isDarkMode()),
      );
      this.setThemeClassOnBody();
    });
  }

  private initIsDarkMode() {
    const isDarkMode: boolean = JSON.parse(
      window.localStorage.getItem(APP_STORAGE_NAMES.isDarkMode) ??
        window.matchMedia('(prefers-color-scheme: dark)').matches.toString(),
    );
    this.isDarkMode.set(isDarkMode);
    this.setThemeClassOnBody();
  }

  private setThemeClassOnBody(): void {
    this.isDarkMode()
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark');
  }

  toggleThemeMode() {
    this.isDarkMode.set(!this.isDarkMode());
  }
}

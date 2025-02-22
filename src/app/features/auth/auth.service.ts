import { inject, Injectable } from '@angular/core';
import { EncryptionService } from '../../shared/services/encryption.service';
import { APP_STORAGE_NAMES } from '../../shared/models/app-storage-name.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private encryptionService = inject(EncryptionService);

  password = '';

  async canDecryptEndpoints(password: string): Promise<boolean> {
    const encryptedDataString = window.localStorage.getItem(
      APP_STORAGE_NAMES.monitoringEndpoints,
    );
    if (!encryptedDataString) return false;

    try {
      await this.encryptionService.decryptData(
        JSON.parse(encryptedDataString),
        password,
      );
    } catch (error) {
      return false;
    }

    return true;
  }
}

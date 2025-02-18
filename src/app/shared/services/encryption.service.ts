import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private async deriveKey(password: string, salt: Uint8Array) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async encryptData(data: string, password: string) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);

    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(data),
    );

    return {
      encryptedData: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      salt: btoa(String.fromCharCode(...salt)),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }

  async decryptData(encryptedData: any, password: string) {
    const dec = new TextDecoder();

    const salt = new Uint8Array(
      atob(encryptedData.salt)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );
    const iv = new Uint8Array(
      atob(encryptedData.iv)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );
    const key = await this.deriveKey(password, salt);

    const encryptedBytes = new Uint8Array(
      atob(encryptedData.encryptedData)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBytes,
    );

    return dec.decode(decrypted);
  }
}

import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { StorageKeys } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  /**
   * Save signup data to local storage
   * 
   * @param data - The signup data to be saved
   */
  async saveSignUpData(data: any) {
    await Preferences.set({
      key: StorageKeys.SignUpData,
      value: JSON.stringify(data)
    });
  }

  /**
   * Get token from signup data in local storage
   * 
   * @returns The token if available, otherwise null
   */
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: StorageKeys.SignUpData });
    if (value) {
      const valueJson = JSON.parse(value);
      return valueJson?.meta?.session_token || null;
    }
    return null;
  }

}

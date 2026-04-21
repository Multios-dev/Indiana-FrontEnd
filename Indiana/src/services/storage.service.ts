import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public getItem(key: string) {
    return localStorage.getItem('Indiana_' + key);
  }

  public setItem(key: string, value: string) {
    localStorage.setItem('Indiana_' + key, value);
  }

  public removeItem(key: string) {
    localStorage.removeItem('Indiana_' + key);
  }
}

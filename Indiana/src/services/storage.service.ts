import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public getItem(key: string) {
    return localStorage.getItem('TempoTeris_' + key);
  }

  public setItem(key: string, value: string) {
    localStorage.setItem('TempoTeris_' + key, value);
  }

  public removeItem(key: string) {
    localStorage.removeItem('TempoTeris_' + key);
  }
}

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class RouterUtils {
  private _router = inject(Router);
  private _storageService = inject(StorageService);

  constructor() {}

  public goBack() {
    history.back();
  }

  public toAuth(): Promise<boolean> {
    return this._router.navigate(['auth']);
  }

  public toPublic(): Promise<boolean> {
    return this._router.navigate(['public']);
  }

  public toInnerLogin(baseSegments: string): Promise<boolean> {
    return this._router.navigate([baseSegments, 'account', 'login']);
  }

  public toInnerSignup(baseSegments: string): Promise<boolean> {
    return this._router.navigate([baseSegments, 'account', 'signup']);
  }

}

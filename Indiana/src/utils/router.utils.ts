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

  //TODO, toutes les routes doivent passer par le router.utils, à revoir pour éviter les redondances 
  //et centraliser la logique de navigation
  public toAuth(): Promise<boolean> {
    return this._router.navigate(['auth']);
  }

  public toPublic(): Promise<boolean> {
    return this._router.navigate(['public']);
  }

  //TODO: logique de connexion et de register directement dans la page login et signup, donc pas besoin de ces méthodes
  public toInnerLogin(baseSegments: string): Promise<boolean> {
    return this._router.navigate([baseSegments, 'account', 'login']);
  }

  public toInnerSignup(baseSegments: string): Promise<boolean> {
    return this._router.navigate([baseSegments, 'account', 'signup']);
  }

}

import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RouterUtils } from '../../utils/router.utils';
import { KeyCloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, TranslateModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  private _keyCloakService = inject(KeyCloakService);
  private _router = inject(Router);
  private _routerUtils = inject(RouterUtils);
  private _activeRoute = this._router.routerState.snapshot.url.split('/account')[0];

  public islogin: boolean = false;
  public isOtp: boolean = this._keyCloakService.isOtp();
  public isNeedResetPassword: boolean = this._keyCloakService.isResetPassword();

  constructor() {
    effect(() => {
      this.isOtp = this._keyCloakService.isOtp();
      this.isNeedResetPassword = this._keyCloakService.isResetPassword();
    });
  }

  public ngOnInit() {
    this._routerUtils.toInnerLogin(this._activeRoute);
   }

  public login() {
    if(this.isNeedResetPassword) {
      this._keyCloakService.isResetPassword.set(false);
    } else {
      this._routerUtils.toInnerLogin(this._activeRoute);
      this.islogin = false;
    }
  }

  public signup() {
    this._routerUtils.toInnerSignup(this._activeRoute);
    this.islogin = true;
  }
}

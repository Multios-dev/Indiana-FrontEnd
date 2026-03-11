import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../services/toast.service';
import { TokenService } from '../../../../services/token.service';
import { hasErrorAndTouched } from '../../../../utils/methods-utils';
import { CardModule } from 'primeng/card';
import { KeyCloakService } from '../../../../services/keycloak.service';
import { KeycloakConnectionReturn, KeycloakConnectionReturnOtp } from '../../../../models/keycloak/keycloak-connection-return';
import { InputOtpModule } from 'primeng/inputotp';
import { KeyCloakLogin } from '../../../../models/keycloak/keycloak-login';
import { take } from 'rxjs';

@Component({
  selector: 'app-shared-login',
  standalone: true,
  imports: [    
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputOtpModule,
    InputTextModule,
    NgxSpinnerModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule,
    TranslateModule
  ],
  templateUrl: './shared-login.component.html',
  styleUrl: './shared-login.component.scss'
})
export class SharedLoginComponent implements OnInit {
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _keycloakService = inject(KeyCloakService);
  private _spinnerService = inject(NgxSpinnerService);
  private _storageService = inject(StorageService);
  private _toastService = inject(ToastService);
  private _tokenService = inject(TokenService);
  private _translateService = inject(TranslateService);
  
  public hasErrorAndTouched = hasErrorAndTouched;
  public isNeedResetPassword: boolean = this._keycloakService.isResetPassword();
  public loggedIn: WritableSignal<boolean> = signal(false);
  public loginForm: FormGroup = new FormGroup({});
  public needOtp: boolean = false;
  public otp: string = '';
  public resetEmail: string = '';

  constructor() {
    effect(() => {
      this.isNeedResetPassword = this._keycloakService.isResetPassword();
    });
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: [
        this._storageService.getItem('username') ?? '',Validators.required
      ],
      password: ['', Validators.required]
    });
  }

  public askResetPassword() {
    this.isNeedResetPassword = true;
    this._keycloakService.isResetPassword.set(true);
  }

  public login() {
    if (this.loginForm.valid) {
      this._spinnerService.show();
      this._keycloakService.preLogin(this.loginForm.value).subscribe({
        next: (res: KeycloakConnectionReturn) => {
          if(res.exists && res.valid_password) {
            this.needOtp = true;
            this._keycloakService.isOtp.set(true);
          } else {
            if(!res.exists) {
              this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.ACCOUNTNOTEXIST'), 'error', this._translateService.instant('ERROR'));
            }
            else if(!res.valid_password) {
              this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.INVALIDPASSWORD'), 'error', this._translateService.instant('ERROR'));
            }
          }
          this._spinnerService.hide();
        },
        error: (err) => {
          if (err.status === 400) {
            this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.INVALID'), 'error', this._translateService.instant('ERROR'));
          } else if(err.status === 403) {
            this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.EMAILNOTVALIDATED'), 'error', this._translateService.instant('ERROR'));
          } else {
            this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.SERVERERROR'), 'error', this._translateService.instant('ERROR'));
          }
          this._spinnerService.hide();
        },
      });
    }
  }

  public sendRequestEmail() {
    this._spinnerService.show();
    this._keycloakService.requestResetPassword(this.resetEmail)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this._keycloakService.isResetPassword.set(false);
          this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.SENDRESETPASSWORDSUCCESS'), 'success', this._translateService.instant('SUCCESS'));
          this._spinnerService.hide();
        },
        error: () => {
          this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.SENDRESETPASSWORDERROR'), 'error', this._translateService.instant('ERROR'));
          this._spinnerService.hide();
        }
      });
  }

    public setLoggedIn() {
    this.loggedIn.set(true);
    setTimeout(() => {
      this.loggedIn.set(false);
    }, 0);
  }
  public validateOtp() {
    this._spinnerService.show();
    const loginFormOtp: KeyCloakLogin = this.loginForm.getRawValue();
    loginFormOtp.otp_code = this.otp;
    this._keycloakService.login(loginFormOtp).subscribe({
      next: (res: KeycloakConnectionReturnOtp) => {
        this._storageService.setItem('token', res.access_token);
        this._tokenService.emitTokenExist();
        this._storageService.setItem('username', loginFormOtp.username);
        this._authService.setLoggedIn();
        this._spinnerService.hide();
      },
      error: (err) => {
        this._toastService.showToast('authToast', this._translateService.instant('LOGIN.ERRORMESSAGE.OTPERROR'), 'error', this._translateService.instant('ERROR'));
        this._spinnerService.hide();
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { KeyCloakService } from '../../services/keycloak.service';
import { ToastService } from '../../services/toast.service';
import { KeycloakConnectionReturn } from '../../models/keycloak/keycloak-connection-return';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent { 
  private _keycloakService = inject(KeyCloakService);
  private _loading = inject(NgxSpinnerService);
  private _spinnerService = inject(NgxSpinnerService);
  private _toastService = inject(ToastService);
  private _translateService: any;

  public error: string | null = null;
  public loginForm: FormGroup;
  public needOtp: boolean = false;
  public otp: string = '';
  public showPassword = signal(false);
  
 

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
  ) {
    this.loginForm = this._fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
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
    
  public togglePassword() {
    this.showPassword.update(v => !v);
  }

  public submit() {
    this.error = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    this._loading.show();
    setTimeout(() => {
      this._loading.hide();
    },500);

    // this.auth.login(username!, password!).subscribe({
    //   next: () => {
    //     this._loading.hide();
    //     this.router.navigate(['/auth']);
    //   },
    //   error: () => {
    //     this._loading.hide();
    //     this.error = 'Identifiants invalides';
    //   },
    // });
  }

  public get username() {
    return this.loginForm.get('username');
  }

  public get password() {
    return this.loginForm.get('password');
  }
}
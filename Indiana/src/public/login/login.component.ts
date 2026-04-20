import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';

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
  private _auth = inject(AuthService);
  private _spinnerService = inject(NgxSpinnerService);
  private _toastService = inject(ToastService);
  private _translateService = inject(TranslateService);
  private _router = inject(Router);

  public error: string | null = null;
  public loginForm: FormGroup;
  public showPassword = signal(false);

  constructor(
    private _fb: FormBuilder,
  ) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public get email() {
    return this.loginForm.get('email');
  }

  public get password() {
    return this.loginForm.get('password');
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

    const { email, password } = this.loginForm.value;
    this._spinnerService.show();
    
    this._auth.loginWithEmail(email, password).subscribe({
      next: (res) => {
        this._spinnerService.hide();
        this._toastService.showToast(
          'authToast',
          this._translateService.instant('LOGIN.SUCCESS'),
          'success',
          this._translateService.instant('SUCCESS')
        );
        this._router.navigate(['/scouts/dashboard']);
      },
      error: (err) => {
        this._spinnerService.hide();
        let errorMessage = this._translateService.instant('LOGIN.ERRORMESSAGE.SERVERERROR');
        
        if (err.status === 401) {
          errorMessage = this._translateService.instant('LOGIN.ERRORMESSAGE.INVALIDPASSWORD');
        } else if (err.status === 404) {
          errorMessage = this._translateService.instant('LOGIN.ERRORMESSAGE.ACCOUNTNOTEXIST');
        }
        
        this._toastService.showToast(
          'authToast',
          errorMessage,
          'error',
          this._translateService.instant('ERROR')
        );
      }
    });
  }

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
    // }

  public get username() {
    return this.loginForm.get('username');
  }
}
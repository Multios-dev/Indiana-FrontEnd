import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { KeyCloakService } from '../../services/keycloak.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    TranslateModule,
    TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private _keycloakService = inject(KeyCloakService);
  private _loading = inject(NgxSpinnerService);
  private _spinnerService = inject(NgxSpinnerService);
  private _toastService = inject(ToastService);
  private _translateService = inject(TranslateService);

  public emailSent = false;
  public form: FormGroup;
  public resetEmail: string = '';
 

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this._loading.show();

    // TODO: replace with real API call
    // The backend should send a password-reset email to form.value.email
    console.log('Reset requested for:', this.form.value.email);

    setTimeout(() => {
      this.emailSent = true;
      this._loading.hide();
      this.cdr.detectChanges();
    }, 1500);
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
}

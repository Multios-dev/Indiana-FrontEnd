import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { KeyCloakService } from '../../services/keycloak.service';
import { SidebarService } from '../../services/sidebar.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';

type LoginStep = 'credentials' | 'otp';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    TranslatePipe,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private _auth = inject(AuthService);
  private _keycloak = inject(KeyCloakService);
  private _spinnerService = inject(NgxSpinnerService);
  private _toastService = inject(ToastService);
  private _translateService = inject(TranslateService);
  private _router = inject(Router);
  private _sidebarService = inject(SidebarService);

  // Étape courante du flux de connexion
  public step = signal<LoginStep>('credentials');

  // Formulaire email + mot de passe (étape 1)
  public credentialsForm: FormGroup;
  // Formulaire OTP (étape 2)
  public otpForm: FormGroup;

  public showPassword = signal(false);
  public isLoading = signal(false);

  // Conserve les identifiants pour les passer au vrai login
  private _pendingUsername = '';
  private _pendingPassword = '';

  constructor(private _fb: FormBuilder) {
    this.credentialsForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.otpForm = this._fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this._sidebarService.closeSidebar();
  }

  // ── Getters ────────────────────────────────────────────────────

  public get email() { return this.credentialsForm.get('email'); }
  public get password() { return this.credentialsForm.get('password'); }
  public get otp() { return this.otpForm.get('otp'); }

  public togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  // ── Étape 1 : pre-login ────────────────────────────────────────


public submitCredentials(): void {
  if (this.credentialsForm.invalid) {
    this.credentialsForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.credentialsForm.value;
  this.isLoading.set(true);
  this._spinnerService.show();

  this._keycloak.preLogin({ username: email, password }).subscribe({
    next: (res: any) => {
      this._spinnerService.hide();
      this.isLoading.set(false);

      // Cas 1 : utilisateur SANS OTP → le backend connecte directement
      if (res.access_token) {
        this._auth.loginWithKeycloak(res.access_token);
        this._toastService.showToast(
          'authToast',
          this._translateService.instant('LOGIN.SUCCESS'),
          'success',
          this._translateService.instant('SUCCESS')
        );
        this._router.navigate(['/scouts/dashboard']);
        return;
      }

      // Cas 2 : mauvais credentials
      if (!res.exists) {
        this._showError('LOGIN.ERRORMESSAGE.ACCOUNTNOTEXIST');
        return;
      }
      if (!res.valid_password) {
        this._showError('LOGIN.ERRORMESSAGE.INVALIDPASSWORD');
        return;
      }

      // Cas 3 : utilisateur AVEC OTP → passer à l'étape OTP
      this._pendingUsername = email;
      this._pendingPassword = password;
      this.step.set('otp');
    },
    error: (err) => {
      this._spinnerService.hide();
      this.isLoading.set(false);
      const key = err.status === 404
        ? 'LOGIN.ERRORMESSAGE.ACCOUNTNOTEXIST'
        : 'LOGIN.ERRORMESSAGE.SERVERERROR';
      this._showError(key);
    },
  });
}

  // ── Étape 2 : login OTP ────────────────────────────────────────

  public submitOtp(): void {
  if (this.otpForm.invalid) {
    this.otpForm.markAllAsTouched();
    return;
  }

  const { otp } = this.otpForm.value;
  this.isLoading.set(true);
  this._spinnerService.show();

  this._keycloak.login({
    username: this._pendingUsername,
    password: this._pendingPassword,
    otp_code: otp,
  }).subscribe({
    next: (res) => {
      // 1. Stocker le token Keycloak
      this._auth.loginWithKeycloak(res.access_token);

      // 2. Appeler le backend local pour récupérer le profil
      this._auth.loginWithEmail(this._pendingUsername, this._pendingPassword).subscribe({
        next: () => {
          this._spinnerService.hide();
          this.isLoading.set(false);

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
          this.isLoading.set(false);
          console.error('Erreur backend local:', err);
          // On navigue quand même car Keycloak est OK
          this._router.navigate(['/scouts/dashboard']);
        }
      });
    },
    error: (err) => {
      this._spinnerService.hide();
      this.isLoading.set(false);
      const key = err.status === 401
        ? 'LOGIN.ERRORMESSAGE.INVALIDOTP'
        : 'LOGIN.ERRORMESSAGE.SERVERERROR';
      this._showError(key);
    },
  });
}

  // ── Navigation entre étapes ────────────────────────────────────

  public backToCredentials(): void {
    this.step.set('credentials');
    this.otpForm.reset();
    this._pendingUsername = '';
    this._pendingPassword = '';
  }

  // ── Helpers ────────────────────────────────────────────────────

  private _showError(i18nKey: string): void {
    this._toastService.showToast(
      'authToast',
      this._translateService.instant(i18nKey),
      'error',
      this._translateService.instant('ERROR')
    );
  }
}

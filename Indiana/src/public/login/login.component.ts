import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

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
  private _loading = inject(NgxSpinnerService);
  
  public error: string | null = null;
  public loginForm: FormGroup;
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

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  submit() {
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

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
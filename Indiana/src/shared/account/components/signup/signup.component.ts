import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidator } from '../../validators/password.validator';
import { AuthService } from '../../../../services/auth.service';
import { take } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { hasErrorAndTouched } from '../../../../utils/methods-utils';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { KeyCloakAdmin } from '../../../../models/keycloak/keycloak-admin';
import { KeyCloakService } from '../../../../services/keycloak.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    NgxSpinnerModule,
    PasswordModule,
    ReactiveFormsModule,
    StepperModule,
    ToastModule,
    TranslateModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _keycloakService = inject(KeyCloakService);
  private _spinnerService = inject(NgxSpinnerService);
  private _toastService = inject(ToastService);
  private _translateService = inject(TranslateService);

  private _emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  private _pswRegex = /^(?=.*[!@#=$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).{6,}$/;

  public active: number | undefined = 0;
  public hasErrorAndTouched = hasErrorAndTouched;
  public companyForm: FormGroup = new FormGroup({});
  public userForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.companyForm = this._formBuilder.group({
      company_address: ['', Validators.required],
      company_country: ['', Validators.required],
      company_email: ['', Validators.required],
      company_name: ['', Validators.required],
      company_number: ['', Validators.required],
      company_postal_code: ['', Validators.required]
    });

    this.userForm = this._formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(this._emailRegex)]
      ],
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      telephone: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.pattern(this._pswRegex),
      ]],
      passwordConfirm: ['', [
        Validators.required,
        Validators.pattern(this._pswRegex),
      ]]
    },{
      validator: PasswordValidator('password', 'passwordConfirm')
    });
  }

  public signup() {
    this._spinnerService.show();
    const userSignup: KeyCloakAdmin = this.companyForm.getRawValue();
    userSignup.email = this.userForm.controls['email'].value;
    userSignup.last_name = this.userForm.controls['last_name'].value;
    userSignup.first_name = this.userForm.controls['first_name'].value;
    userSignup.telephone = this.userForm.controls['telephone'].value;
    userSignup.username = this.userForm.controls['username'].value;
    userSignup.password = this.userForm.controls['password'].value;
    userSignup.email_verified = false;
    this._keycloakService.createAdmin(userSignup)
                     .pipe(take(1))
                     .subscribe({
                      next: () => {
                        this._authService.setLoggedIn();
                        this._spinnerService.hide();
                      },
                      error: () => {
                        this._toastService.showToast('authToast', this._translateService.instant('SIGNUP.ERRORMESSAGE.SERVERERROR'), 'error', this._translateService.instant('ERROR'))
                        this._spinnerService.hide();
                      }
                     });
  }
}

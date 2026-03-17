import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PasswordDirective } from "primeng/password";

@Component({
  selector: 'app-register-manual',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslatePipe
],
  templateUrl: './register-manual.component.html',
  styleUrls: ['./register-manual.component.scss'],
})
export class RegisterManualComponent {
  public accountCreated = false;
  public form: FormGroup;

  private _loading = inject(NgxSpinnerService);

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      lastName:    ['', Validators.required],
      firstNames:  this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      birthDate:   ['', Validators.required],
      gender:      ['', Validators.required],
      nationality: ['', Validators.required],
      street:      ['', Validators.required],
      zip:         ['', Validators.required],
      city:        ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      phone:       [''],
      password:    ['', Validators.required]
    });
  }

  get firstNames(): FormArray {
    return this.form.get('firstNames') as FormArray;
  }

  addFirstName(): void {
    this.firstNames.push(this.fb.control('', Validators.required));
  }

  removeFirstName(index: number): void {
    this.firstNames.removeAt(index);
  }

  isFirstNameInvalid(index: number): boolean {
    const ctrl = this.firstNames.at(index);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    this.firstNames.controls.forEach(c => c.markAsTouched());

    if (this.form.invalid) {
      return;
    }

    this._loading.show();

    // TODO: replace with real API call
    // The backend should:
    //   1. Create a [Personne] record (no Numéro de Registre National)
    //   2. Generate an internal SGP identifier
    //   3. Create the user account (role: Simple utilisateur)
    //   4. Send the first-login email to form.value.email
    console.log('Payload:', this.form.value);

    setTimeout(() => {
      this.accountCreated = true;
      this._loading.hide();
      this.cdr.detectChanges();
    }, 1500);
  }
}
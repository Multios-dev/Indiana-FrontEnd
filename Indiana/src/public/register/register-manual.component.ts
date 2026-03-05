import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register-manual',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register-manual.component.html',
  styleUrls: ['./register-manual.component.scss'],
})
export class RegisterManualComponent {
  form: FormGroup;
  isLoading = false;
  accountCreated = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Identity
      lastName:    ['', Validators.required],
      firstName:   ['', Validators.required],

      // demographic information
      birthDate:   ['', Validators.required],
      gender:      ['', Validators.required],

      // Nationality
      nationality: ['', Validators.required],

      // Legal domicile 
      street:  ['', Validators.required],
      zip:     ['', Validators.required],
      city:    ['', Validators.required],

      // Contact
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  /** Returns true when the field has been touched and is invalid */
  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to trigger validation display
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // TODO: replace with real API call
    // The backend should:
    //   1. Create a [Personne] record (no Numéro de Registre National)
    //   2. Generate an internal SGP identifier
    //   3. Create the user account (role: Simple utilisateur)
    //   4. Send the first-login email to form.value.email
    console.log('Payload:', this.form.value);

    // Simulate async call
    setTimeout(() => {
      this.isLoading = false;
      this.accountCreated = true;
    }, 1500);
  }
}

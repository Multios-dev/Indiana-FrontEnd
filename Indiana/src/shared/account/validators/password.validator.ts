import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

export function PasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    const minLength = value.length >= 6;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && minLength;
    return !passwordValid ? {
      invalidPassword: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecial,
        minLength
      }
    } : null;
  };
}

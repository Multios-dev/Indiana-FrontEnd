import { AbstractControl, ValidationErrors } from "@angular/forms";

// ── Validateur pour la date de naissance (pas dans le futur) ─
export function birthDateValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const date = new Date(birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today ? null : { invalidBirthDate: true };
  }
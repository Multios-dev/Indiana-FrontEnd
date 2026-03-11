import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DuplicateInArrayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = (control.value ?? []) as string[];
    const normalized = values
      .map((v) => v?.trim().toLowerCase())
      .filter(Boolean);
    const duplicates = normalized.filter((v, i) => normalized.indexOf(v) !== i);
    return duplicates.length ? { duplicate: true } : null;
  };
}

export function crossDuplicateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const emails = (group.get('emails')?.value ?? []) as string[];
    const cc = (group.get('cc')?.value ?? []) as string[];

    const normalize = (arr: string[]) =>
      arr.map((e) => e?.trim().toLowerCase()).filter(Boolean);

    const emailSet = new Set(normalize(emails));
    const cross = normalize(cc).filter((e) => emailSet.has(e));

    return cross.length ? { crossDuplicate: true } : null;
  };
}

import { FormGroup } from '@angular/forms';


export function hasErrorAndTouched(
  form: FormGroup,
  input: string,
  validator: string
): boolean | undefined {
  return (
    form.get(input)?.hasError(validator) &&
    (form.get(input)?.touched || form.get(input)?.dirty)
  );
}
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class BaseFormUser {
  private _isName = /^[a-zA-Z]{4,}\s[a-zA-Z]{4,}/i;
  errorMessage = null;
  constructor(private fb: FormBuilder) {};

  baseForm = this.fb.group(
    {
      name: ['', [Validators.required,Validators.pattern(this._isName)]],
      age: ['', [Validators.required, Validators.min(18)]],
      birth: ['',Validators.required],
      inscription: ['',Validators.required],
    },
    {
      validators: [
        this.validateAge('age', 'birth'),
        this.validateInscription('inscription', 'birth')
      ],
    }
  );


  

  validateAge(age: string, birth: string) {
    return function (formGroup: AbstractControl): ValidationErrors | null {
      const controlBirth = formGroup.get(birth);
      const controlAge = formGroup.get(age);

      let nacimiento = moment(controlBirth.value,'yyyy-MM-DD');
      let hoy = moment();
      let edad = hoy.diff(nacimiento, 'years');

      if (Number(controlAge.value) === edad) {
        return null;
      } else {
        const errors = { doNotMatch: true };
        controlAge?.setErrors({ ...controlAge?.errors, ...errors });
        return errors;
      }
    };
  }

  validateInscription(inscription: string, birth: string) {
    return function (formGroup: AbstractControl): ValidationErrors | null {
      const controlInscription = formGroup.get(inscription);
      const controlBirth = formGroup.get(birth);

      let inscripcionDate = moment(controlInscription.value, 'yyyy-MM-DD');
      let birthDate = moment(controlBirth.value, 'yyyy-MM-DD');

      if (inscripcionDate.isAfter(birthDate)) {
        return null;
      } else {
        const errors = { doNotMatch: true };
        controlInscription?.setErrors({
          ...controlInscription?.errors,
          ...errors,
        });
        return errors;
      }
    };
  }

  isValidField(field: string): boolean {
    this.getErrorMessage(field);
    return (
      (this.baseForm.get(field)?.touched || this.baseForm.get(field)?.dirty)! &&
      !this.baseForm.get(field)?.valid
    );
  }

  private getErrorMessage(field: string): void {
    const { errors } = this.baseForm.get(field)!;
    if (errors) {
      const minLength = errors?.['minlength']?.requiredLength;

      const messages = {
        required: 'Debe ingresar un valor correcto',
        pattern: 'Minimo dos nombres con 4 caracteres cada uno',
        minLength: `Debe tener minimo ${minLength} caracteres`,
        min: `El usuario debe tener minimo 18 anios de edad`,
      };
      const errorKey = Object.keys(errors).find(Boolean);
      this.errorMessage = messages[errorKey];
    }
  }
}

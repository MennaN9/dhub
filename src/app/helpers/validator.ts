/**
 * @author Mustafa Omran<promustafaomran@hotmail.com>
 *
 * Validate Reactive form
 * 
 */
import { FormGroup, FormControl } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

/**
 * validate phone number via code
 * 
 * 
 * @param phoneNumber 
 * @param regionCode 
 */
export function phoneNumberValidator(phoneNumber: string, regionCode: string): boolean {

  let phone = phoneNumberUtil.parseAndKeepRawInput(phoneNumber, regionCode);

  let valid = phoneNumberUtil.isValidNumber(phone);
  if (valid) {
    return true;
  }
}

/**
 * validate form
 *
 *
 * @param formGroup
 */
export function validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}

/**
 * validate one input
 *
 *
 * @param field
 */
export function isFieldValid(field: string) {
  return !this.form.get(field).valid && this.form.get(field).touched;
}

/**
 * display css
 *
 *
 * @param field
 */
export function displayFieldCss(field: string) {
  return {
    'has-error': isFieldValid(field),
    'has-feedback': isFieldValid(field)
  };


}

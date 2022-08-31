import { FormGroup } from "@angular/forms";

/**
 * show error for input 
 * 
 * 
 * @param form 
 * @param input 
 * @param msg 
 */
export function getError(form: FormGroup, input: string, msg: string): String {
    if (form.get(input)) {
        if (form.get(input).hasError('required') || form.get(input).hasError('email')) {
            return this.translateService.instant(msg);
        }
    }
}
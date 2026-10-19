import type {ValidationOptions, ValidationsType} from "../types/validations.type";

export class ValidationUtils {
    public static validateForm(validations: ValidationsType[]): boolean {
        let isValid: boolean = true;

        for (let i = 0; i < validations.length; i++) {
            const validation: ValidationsType | undefined = validations[i];
            if (validation && validation.element) {
                const validationResult: boolean = ValidationUtils.validateField(validation.element, validation.options);
                if (!validationResult) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    public static validateField(element: HTMLInputElement, options: ValidationOptions | undefined): boolean {
        let condition: string | RegExpMatchArray | boolean | null = element.value;
        if (options) {

            if (options.hasOwnProperty('pattern')) {
                condition = element.value && element.value.match(options.pattern);
            } else if (options.hasOwnProperty('compareTo')) {
                condition = element.value && element.value === options.compareTo;
            } else if (options.hasOwnProperty('checkProperty')) {
                condition = options.checkProperty;
            } else if (options.hasOwnProperty('checked')) {
                condition = element.checked;
            }
        }
        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        } else {
            element.classList.add('is-invalid');
            return false;
        }
    }
}
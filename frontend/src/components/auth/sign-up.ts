import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import type {ValidationsType} from "../../types/validations.type";
import type {CustomResponseData} from "../../types/http-response.type";

export class SignUp {
    readonly openNewRoute: (route: string) => void;
    readonly validations: ValidationsType[] = [];
    private nameElement: HTMLInputElement | null = null;
    private lastNameElement: HTMLInputElement | null = null;
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private passwordRepeatElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLInputElement | null = null;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.findElements();

        this.validations = [
            {element: this.nameElement, options: {pattern: /^[А-ЯЁ][а-яёА-ЯЁ ]*$/}},
            {element: this.lastNameElement, options: {pattern: /^[А-ЯЁ][а-яёА-ЯЁ ]*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {
                element: this.passwordRepeatElement,
                options: {compareTo: this.passwordElement ? this.passwordElement.value : ''}
            },

        ];

        const btnSignUp: HTMLElement | null = document.getElementById('process-button');
        if (btnSignUp) {
            btnSignUp.addEventListener('click', this.signUp.bind(this));
        }
    }

    private findElements(): void {
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.lastNameElement = document.getElementById('lastName') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password2') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLInputElement;
    }

    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        for (let i = 0; i < this.validations.length; i++) {
            const validation: ValidationsType | undefined = this.validations[i];
            if (validation && validation.element) {
                if (validation.element === this.passwordRepeatElement) {
                    if (validation.options && this.passwordElement)
                        validation.options.compareTo = this.passwordElement.value;
                }
            }
        }
        if (ValidationUtils.validateForm(this.validations)) {
            const name: string = this.nameElement?.value ?? "";
            const lastName: string = this.lastNameElement?.value ?? "";
            const email: string = this.emailElement?.value ?? "";
            const password: string = this.passwordElement?.value ?? "";
            const passwordRepeat: string = this.passwordRepeatElement?.value ?? "";

            const signupResult: boolean | CustomResponseData = await AuthService.signUp({
                name: name,
                lastName: lastName,
                email: email,
                password: password,
                passwordRepeat: passwordRepeat,
            });
            if (signupResult) {
                const loginResult: boolean | CustomResponseData = await AuthService.logIn(JSON.stringify({
                    email: email,
                    password: password,
                    rememberMe: false
                }));
                if (loginResult && typeof loginResult !== 'boolean') {
                    const authData = loginResult as CustomResponseData;
                    if (authData.tokens && authData.user) {
                        AuthUtils.setAuthInfo(authData.tokens.accessToken, authData.tokens.refreshToken, {
                            id: authData.user.id,
                            name: authData.user.name,
                            lastName: authData.user.lastName
                        });


                        return this.openNewRoute('/');
                    }
                }

            }
            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}
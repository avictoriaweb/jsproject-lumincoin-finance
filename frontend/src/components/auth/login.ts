import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";
import type {CustomResponseData} from "../../types/http-response.type";
import type {ValidationsType} from "../../types/validations.type";

export class Login {
    readonly openNewRoute: (route: string) => void;
    readonly validations:ValidationsType[] = [];
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private rememberMeElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLInputElement | null = null;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ];

        const processButton: HTMLElement | null = document.getElementById('process-button');
        if (processButton) {
            processButton.addEventListener('click', this.login.bind(this));
        }
    }

    private findElements(): void {
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('checkRememberMe') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLInputElement;
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (ValidationUtils.validateForm(this.validations)) {
            const email: string = this.emailElement ? this.emailElement.value : '';
            const password: string = this.passwordElement ? this.passwordElement.value : '';
            const rememberMe: boolean = this.rememberMeElement ? this.rememberMeElement.checked : false;

            const loginResult: CustomResponseData | boolean = await AuthService.logIn(JSON.stringify({
                email: email,
                password: password,
                rememberMe: rememberMe
            }));
            if (loginResult && typeof loginResult !== 'boolean') {
                const authData: CustomResponseData = loginResult as CustomResponseData;
                if (authData.tokens && authData.user) {
                    AuthUtils.setAuthInfo(authData.tokens.accessToken, authData.tokens.refreshToken, {
                        id: authData.user.id,
                        name: authData.user.name,
                        lastName: authData.user.lastName
                    }, this.rememberMeElement ? this.rememberMeElement.checked : false);
                }
                return this.openNewRoute('/');
            }
            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}
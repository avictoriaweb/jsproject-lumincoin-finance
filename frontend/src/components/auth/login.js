import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ];

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('checkRememberMe');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (ValidationUtils.validateForm(this.validations)) {

            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });
            if (loginResult) {
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName
                }, this.rememberMeElement.checked);

                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}
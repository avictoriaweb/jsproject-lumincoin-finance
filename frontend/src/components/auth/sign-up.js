import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";

export class SignUp{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)){
            return this.openNewRoute('/');
        }

       this.findElements();

        this.validations = [
            {element: this.nameElement, options: {pattern: /^[А-ЯЁ][а-яёА-ЯЁ ]*$/}},
            {element: this.lastNameElement, options: {pattern: /^[А-ЯЁ][а-яёА-ЯЁ ]*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},

        ];

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    findElements(){
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('lastName');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password2');
        this.commonErrorElement =  document.getElementById('common-error');
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        for (let i = 0; i < this.validations.length; i++) {
            if(this.validations[i].element === this.passwordRepeatElement){
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }
        if (ValidationUtils.validateForm(this.validations)) {
            const signupResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });
            console.log(signupResult);
            if (signupResult) {
                const loginResult = await AuthService.logIn({
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        rememberMe: false
                });
                console.log(loginResult);
                if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                        id: loginResult.user.id,
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName
                    });

                    return this.openNewRoute('/');
                }


            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}
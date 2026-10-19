import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    readonly openNewRoute: (route: string) => void;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {

        await AuthService.logOut(JSON.stringify({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        }));
        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}
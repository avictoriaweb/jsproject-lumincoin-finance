import config from "../config/config";
import type {AuthInfo, AuthKey} from "../types/authkey.type";
import type {UserInfoType} from "../types/user-info.type";

export class AuthUtils {
    public static readonly accessTokenKey = 'accessToken' as const;
    public static readonly refreshTokenKey = 'refreshToken' as const;
    public static readonly userInfoTokenKey = 'userInfo' as const;


    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null= null, rememberMe = false): void {
        const storage = rememberMe ? localStorage : sessionStorage;
        if (accessToken && refreshToken) {
            storage.setItem(this.accessTokenKey, accessToken);
            storage.setItem(this.refreshTokenKey, refreshToken);
            if (userInfo) {
                storage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
            }
        } else {
            this.removeAuthInfo();
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
        sessionStorage.clear();
    }

    public static getKeyFromStorage(key: AuthKey): string | null {
        const value: string | null | undefined = localStorage.getItem(key) || sessionStorage.getItem(key);
        return (value === 'undefined' || value === 'null' || !value) ? null : value;
    }

    public static getAuthInfo(key: AuthKey | null = null): string | null | AuthInfo {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return this.getKeyFromStorage(key);

        } else {
            return {
                [AuthUtils.accessTokenKey]: this.getKeyFromStorage(this.accessTokenKey),
                [AuthUtils.refreshTokenKey]: this.getKeyFromStorage(this.refreshTokenKey),
                [AuthUtils.userInfoTokenKey]: this.getKeyFromStorage(this.userInfoTokenKey),
            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null | AuthInfo = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });
            if (response && response.status === 200) {
                const tokenData = await response.json();
                if (tokenData && !tokenData.error) {
                    const tokens = tokenData.tokens;
                    if (tokens && !tokens.error && tokens.accessToken && tokens.refreshToken) {
                        this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                        result = true;
                    }
                }

            }
        }
        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }
}
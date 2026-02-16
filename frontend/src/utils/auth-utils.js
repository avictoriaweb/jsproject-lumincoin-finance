import config from "../config/config";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';


    static setAuthInfo(accessToken, refreshToken, userInfo = null, rememberMe = false) {
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

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
        sessionStorage.clear();
    }

    static getKeyFromStorage(key) {
        const value = localStorage.getItem(key) || sessionStorage.getItem(key);
        return (value === 'undefined' || value === 'null' || !value) ? null : value;
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return this.getKeyFromStorage(key);

        } else {
            return {
                [this.accessTokenKey]: this.getKeyFromStorage(this.accessTokenKey),
                [this.refreshTokenKey]: this.getKeyFromStorage(this.refreshTokenKey),
                [this.userInfoTokenKey]: this.getKeyFromStorage(this.userInfoTokenKey),
            }
        }
    }

    static async updateRefreshToken() {
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });
            if (response && response.status === 200) {
                const tokenData = await response.json();
                if(tokenData && !tokenData.error){
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
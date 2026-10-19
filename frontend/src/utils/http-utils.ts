import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import type {HttpResponseType} from "../types/http-response.type";
import type {HttpRequestType} from "../types/http-request.type";
import type {AuthInfo} from "../types/authkey.type";

export class HttpUtils {
    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: string | null = null): Promise<HttpResponseType> {
        const result: HttpResponseType = {
            error: false,
            response: null
        };

        const params: HttpRequestType = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            },
        };
        let token: string | AuthInfo | null = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token as string;
            }
        }
        if (body) {
            params.body = JSON.stringify(body);
            //params.body = body;
        }
        let response:Response | null= null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    //1-токена нет
                    result.redirect = '/login';
                } else {
                    //2 - токен устарел/невалидный (надо обновить)
                    const updateTokenResult:boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }

        }

        return result;
    }
}
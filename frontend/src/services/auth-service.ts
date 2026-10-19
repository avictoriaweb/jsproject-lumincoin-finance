import {HttpUtils} from "../utils/http-utils";
import type {CustomResponseData, HttpResponseType} from "../types/http-response.type";

export class AuthService {
    public static async logIn(data: string): Promise<CustomResponseData | boolean> {
        const result: HttpResponseType = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens?.accessToken || !result.response.tokens?.refreshToken || !result.response.user?.id || !result.response.user?.name || !result.response.user?.lastName))) {
            return false;
        }
        return result.response;
    }

    public static async signUp(data: any): Promise<CustomResponseData | boolean> {
        const result: HttpResponseType = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.user?.id || !result.response.user?.email || !result.response.user?.name || !result.response.user?.lastName))) {
            return false;
        }
        return result.response;
    }

    public static async logOut(data: string): Promise<void> {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}
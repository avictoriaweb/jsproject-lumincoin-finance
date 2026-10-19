import {HttpUtils} from "../utils/http-utils";
import type {BalanceType} from "../types/balance.type";
import type {HttpResponseType} from "../types/http-response.type";

export class BalanceService {
    public static async getBalance():Promise<BalanceType> {
        const returnObject: BalanceType = {
            error: false,
            redirect: null,
            balance: null
        };
        const result:HttpResponseType = await HttpUtils.request('/balance');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе баланса. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response;

        return returnObject;
    }
}
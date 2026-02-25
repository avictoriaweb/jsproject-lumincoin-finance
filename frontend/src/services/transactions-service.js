import {HttpUtils} from "../utils/http-utils";

export class TransactionsService {
    static async getTransactionsList(type = 'today', dateFrom = null, dateTo = null) {
        const returnObject = {
            error: false,
            redirect: null,
            transactions: null
        };
        let queryString = '/operations/?period=' + type;
        if (dateFrom) {
            queryString += '&dateFrom=' + dateFrom;
        }
        if (dateTo) {
            queryString += '&dateTo=' + dateTo;
        }
        const result = await HttpUtils.request(queryString);

        if (result.redirect || result.error || !result.response) {
            returnObject.error = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.transactions = result.response;

        return returnObject;
    }
    static async getTransaction(id) {
        const returnObject = {
            error: false,
            redirect: null,
            transaction: null
        };
        const result = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.transaction = result.response;

        return returnObject;
    }
    static async createTransaction(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };
        const result = await HttpUtils.request('/operations', 'POST', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;

        return returnObject;
    }

    static async editTransaction(id, data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };
        const result = await HttpUtils.request('/operations/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;

        return returnObject;
    }

    static async deleteTransaction(id) {
        const returnObject = {
            error: false,
            redirect: null,
        };
        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}
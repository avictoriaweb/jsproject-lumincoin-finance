import {HttpUtils} from "../utils/http-utils";
import type {TransactionResult, TransactionsResult} from "../types/transactions.type";
import type {Transaction} from "../types/transactions.type";
import type {HttpResponseType} from "../types/http-response.type";

export class TransactionsService {
    public static async getTransactionsList(type: string | null = 'today', dateFrom: string | null = null, dateTo: string | null = null): Promise<TransactionsResult> {
        const returnObject: TransactionsResult = {
            error: false,
            redirect: null,
            transactions: null
        };
        let queryString: string = '/operations/?period=' + type;
        if (dateFrom) {
            queryString += '&dateFrom=' + dateFrom;
        }
        if (dateTo) {
            queryString += '&dateTo=' + dateTo;
        }
        const result: HttpResponseType = await HttpUtils.request(queryString);

        if (result.redirect || result.error || !result.response) {
            returnObject.error = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.transactions = result.response as Transaction[];

        return returnObject;
    }

    public static async getTransaction(id: string): Promise<TransactionResult> {
        const returnObject: TransactionResult = {
            error: false,
            redirect: null,
            transaction: null
        };
        const result: HttpResponseType = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе операции. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.transaction = result.response as Transaction;

        return returnObject;
    }

    public static async createTransaction(data: Transaction): Promise<TransactionResult> {
        const returnObject: TransactionResult = {
            error: false,
            redirect: null,
            id: null
        };
        const result: HttpResponseType = await HttpUtils.request('/operations', 'POST', true, JSON.stringify(data));
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении операции. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        let transactionId: number | undefined = (result.response as Transaction).id;
        if (transactionId) {
            returnObject.id = transactionId;
        }

        return returnObject;
    }

    public static async editTransaction(id: string, data: Transaction): Promise<TransactionResult> {
        const returnObject: TransactionResult = {
            error: false,
            redirect: null,
            id: null
        };
        const result: HttpResponseType = await HttpUtils.request('/operations/' + id, 'PUT', true, JSON.stringify(data));
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании операции. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        let transactionId: number | undefined = (result.response as Transaction).id;
        if (transactionId) {
            returnObject.id = transactionId;
        }

        return returnObject;
    }

    public static async deleteTransaction(id:string): Promise<TransactionResult> {
        const returnObject: TransactionResult = {
            error: false,
            redirect: null,
        };
        const result: HttpResponseType = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении операции. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}
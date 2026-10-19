import {UrlUtils} from "../../utils/url-utils";
import {TransactionsService} from "../../services/transactions-service";
import type {TransactionResult, TransactionsResult} from "../../types/transactions.type";

export class TransactionDelete {
    readonly openNewRoute: (route: string) => void;
    constructor(openNewRoute: (route: string) => void){
        this.openNewRoute = openNewRoute;
        const id:string|null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }

        this.deleteTransaction(id).then();
    }
    async deleteTransaction(id:string):Promise<void|null> {
        const response:TransactionResult = await TransactionsService.deleteTransaction(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/transactions');
    }
}
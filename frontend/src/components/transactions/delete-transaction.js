import {UrlUtils} from "../../utils/url-utils";
import {TransactionsService} from "../../services/transactions-service";

export class TransactionDelete {
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteTransaction(id).then();
    }
    async deleteTransaction(id){
        const response = await TransactionsService.deleteTransaction(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/transactions');
    }
}
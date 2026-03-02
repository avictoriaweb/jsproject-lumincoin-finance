import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";

export class ExpenseDelete {
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteExpense(id).then();
    }
    async deleteExpense(id){
        const response = await CategoryService.deleteCategory('expense', id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/expense-list');
    }
}
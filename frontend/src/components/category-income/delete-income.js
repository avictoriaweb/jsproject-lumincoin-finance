import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";

export class IncomeDelete {
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteIncome(id).then();
    }
    async deleteIncome(id){
        const response = await CategoryService.deleteCategory('income', id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income-list');
    }
}
import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import type {CategoryResult} from "../../types/categories.type";

export class ExpenseDelete {
    readonly openNewRoute: (route: string) => void;

    constructor(openNewRoute: (route: string) => void){
        this.openNewRoute = openNewRoute;
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }

        this.deleteExpense(id).then();
    }
   private async deleteExpense(id:string):Promise<void|null>{
        const response:CategoryResult = await CategoryService.deleteCategory('expense', id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/expense-list');
    }
}
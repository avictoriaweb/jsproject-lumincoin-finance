import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import {ValidationUtils} from "../../utils/validation-utils";
import type {Category, CategoryResult} from "../../types/categories.type";
import type {ValidationsType} from "../../types/validations.type";

export class EditExpense {
    readonly openNewRoute: (route: string) => void;
    readonly id: string = '';
    readonly nameElement: HTMLInputElement | null = null;
    readonly validations: ValidationsType[] = [];

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }
        this.id = id;
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.validations = [
            {element: this.nameElement}
        ]
        this.init(id).then();

        const btnSave: HTMLElement | null = document.getElementById("btnSave");
        if (btnSave) {
            btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        }
        const btnCancel: HTMLElement | null = document.getElementById("btnCancel");
        if (btnCancel) {
            btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
        }
    }

    private async init(id: string): Promise<void> {
        const categoryData: void | CategoryResult = await this.getCategory(id);
        if (categoryData && categoryData.category) {
            if (categoryData.category.title) {
                if (this.nameElement) {
                    this.nameElement.value = categoryData.category.title;
                }
            } else {
                return this.openNewRoute('/');
            }
        }

    }

    private async getCategory(id: string): Promise<CategoryResult | void> {
        const result: CategoryResult = await CategoryService.getCategory('expense', id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе заказа. Обратитесь в поддержку');
        }
        return result;

    }

    private async btnSaveClick(e: Event): Promise<void | null> {
        if (ValidationUtils.validateForm(this.validations)) {
            if (this.nameElement) {
                const title: string = this.nameElement.value;
                const editData: Category = {
                    title: title,
                };
                const response:CategoryResult = await CategoryService.updateCategory('expense', this.id, JSON.stringify(editData));
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
            }
            return this.openNewRoute('/expense-list');
        }
    }

    private btnCancelClick(e:Event):void {
        e.preventDefault();
        return this.openNewRoute('/expense-list');
    }
}
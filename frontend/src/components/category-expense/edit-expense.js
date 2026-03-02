import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class EditExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.id = id;
        this.nameElement = document.getElementById('name');
        this.validations = [
            {element: this.nameElement}
        ]
        this.init(id).then();

        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
    }
    async init(id) {
        const categoryData = await this.getCategory(id);
        if (categoryData) {
            if (categoryData.category.title) {
                this.nameElement.value = categoryData.category.title;
            } else {
                return this.openNewRoute('/');
            }
        }

    }
    async getCategory(id) {
        const result = await CategoryService.getCategory('expense', id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе заказа. Обратитесь в поддержку');
        }
        return result;

    }
    async btnSaveClick (e)  {
        if (ValidationUtils.validateForm(this.validations)) {
            const editData = {
                title: this.nameElement.value,
            };
            const response = await CategoryService.updateCategory('expense', this.id, editData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/expense-list');
        }
    }
    btnCancelClick (e)  {
        e.preventDefault();
        return this.openNewRoute('/expense-list');
    }
}
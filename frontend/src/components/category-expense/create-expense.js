import {ValidationUtils} from "../../utils/validation-utils";
import {CategoryService} from "../../services/category-service";

export class CreateExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
        this.nameElement = document.getElementById('name');
        this.validations = [
            {element: this.nameElement}
        ]
    }

    async btnSaveClick (e)  {
        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                title: this.nameElement.value,
            };
            const response = await CategoryService.createCategory('expense', createData);
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
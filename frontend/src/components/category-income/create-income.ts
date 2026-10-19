import {ValidationUtils} from "../../utils/validation-utils";
import {CategoryService} from "../../services/category-service";
import type {CategoryResult} from "../../types/categories.type";
import type {ValidationsType} from "../../types/validations.type";

export class CreateIncome {
    readonly openNewRoute: (route: string) => void;
    readonly nameElement: HTMLInputElement | null = null;
    readonly validations: ValidationsType[] = [];

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;

        const btnSave: HTMLElement | null = document.getElementById("btnSave");
        if (btnSave) {
            btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        }
        const btnCancel: HTMLElement | null = document.getElementById("btnCancel");
        if (btnCancel) {
            btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
        }
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.validations = [
            {element: this.nameElement}
        ]
    }

    private async btnSaveClick (e:Event):Promise<void|null>  {
       if (ValidationUtils.validateForm(this.validations)) {
           const titleText:string = this.nameElement ? this.nameElement.value : '';
           const createData = {
               title: titleText,
           };

            const response:CategoryResult = await CategoryService.createCategory('income', JSON.stringify(createData));
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/income-list');
        }


    }
    private btnCancelClick (e:Event):void  {
        e.preventDefault();
        return this.openNewRoute('/income-list');
    }
}
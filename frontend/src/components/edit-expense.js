export class EditExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
    }

    btnSaveClick (e)  {
        e.preventDefault();
        return this.openNewRoute('/expense-list');
    }
    btnCancelClick (e)  {
        e.preventDefault();
        return this.openNewRoute('/expense-list');
    }
}
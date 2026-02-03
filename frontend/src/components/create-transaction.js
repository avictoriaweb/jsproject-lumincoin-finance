export class CreateTransaction {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.datePicker = document.getElementById("date");
        this.initDatePicker();
        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
    }
    initDatePicker() {
        this.datePicker.removeEventListener('click', this.handleDateClick);
        this.datePicker.addEventListener('click', this.handleDateClick);
    }

    handleDateClick (e)  {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('data-target');
        const dateInput = document.getElementById(targetId);

        if (dateInput) {
            dateInput.showPicker();
        } else {
            console.error('Date input not found:', targetId);
        }
    }
    btnSaveClick (e)  {
        e.preventDefault();
        return this.openNewRoute('/transactions');
    }
    btnCancelClick (e)  {
        e.preventDefault();
        return this.openNewRoute('/transactions');
    }
}
import * as bootstrap from 'bootstrap';

//import { Modal } from 'bootstrap';

export class Transactions {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.initDatePickers();
        this.btnCreateIncome = document.getElementById("btnCreateIncome");
        this.btnCreateIncome.addEventListener('click', this.btnCreateIncomeClick.bind(this));
        this.btnCreateExpense = document.getElementById("btnCreateExpense");
        this.btnCreateExpense.addEventListener('click', this.btnCreateExpenseClick.bind(this));
        this.transactionIdToDelete = null;
        this.deleteModalElement = document.getElementById('deleteModal');
        this.deleteModal = new bootstrap.Modal(this.deleteModalElement);
        this.btnConfirmDelete = document.getElementById("btnConfirmDelete");
        this.btnConfirmDelete.addEventListener('click', this.btnConfirmDeleteClick.bind(this));
        this.initDeleteButtons();

    }

    initDatePickers() {
        document.querySelectorAll('.date-link').forEach(link => {
            link.removeEventListener('click', this.handleDateClick);
            link.addEventListener('click', this.handleDateClick);
        });
    }

    initDeleteButtons() {
        document.querySelectorAll('.btnDelete').forEach(link => {
            link.removeEventListener('click', this.handleDeleteClick);
            link.addEventListener('click', this.handleDeleteClick.bind(this));
        });
    }

    handleDateClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('data-target');
        const dateInput = document.getElementById(targetId);

        if (dateInput) {
            dateInput.showPicker();
        } else {
            console.error('Date input not found:', targetId);
        }
    }

    handleDeleteClick(e) {
        e.preventDefault();
        this.transactionIdToDelete = e.currentTarget.getAttribute('data-id');
        this.deleteModal.show();

    }

    btnCreateIncomeClick(e) {
        e.preventDefault();
        return this.openNewRoute('/create-transaction');
    }

    btnCreateExpenseClick(e) {
        e.preventDefault();
        return this.openNewRoute('/create-transaction');
    }

    btnConfirmDeleteClick(e) {
        e.preventDefault();
        this.deleteModal.hide();

    }

}
import * as bootstrap from "bootstrap";

export class ExpenseList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.btnCreateExpenceCategory = document.getElementById("btnCreateExpense");
        this.btnCreateExpenceCategory.addEventListener('click', this.btnCreateExpenseCategoryClick.bind(this));
        this.initEditButtons();
        this.categoryIdToDelete = null;
        this.categoryIdToEdit = null
        this.deleteModalElement = document.getElementById('deleteModal');
        this.deleteModal = new bootstrap.Modal(this.deleteModalElement);
        this.btnConfirmDelete = document.getElementById("btnConfirmDelete");
        this.btnConfirmDelete.addEventListener('click', this.btnConfirmDeleteClick.bind(this));
        this.initDeleteButtons();
    }
    btnCreateExpenseCategoryClick(e) {
        e.preventDefault();
        return this.openNewRoute('/create-expense');
    }
    initEditButtons() {
        document.querySelectorAll('.btnEdit').forEach(link => {
            link.removeEventListener('click', this.handleEditClick);
            link.addEventListener('click', this.handleEditClick.bind(this));
        });
    }

    handleEditClick(e) {
        e.preventDefault();
        this.categoryIdToEdit = e.currentTarget.getAttribute('data-id');
        return this.openNewRoute('/edit-expense');
    }

    initDeleteButtons() {
        document.querySelectorAll('.btnDelete').forEach(link => {
            link.removeEventListener('click', this.handleDeleteClick);
            link.addEventListener('click', this.handleDeleteClick.bind(this));
        });
    }

    handleDeleteClick(e) {
        e.preventDefault();
        this.categoryIdToDelete = e.currentTarget.getAttribute('data-id');
        this.deleteModal.show();

    }
    btnConfirmDeleteClick(e) {
        e.preventDefault();
        this.deleteModal.hide();

    }
}
import * as bootstrap from "bootstrap";
import {CategoryService} from "../../services/category-service";

export class IncomeList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.parentElement = document.getElementById('income-container');
        //получаем список категорий
        this.getCategoryList().then();

    }

    async getCategoryList() {
        const categoryList = await CategoryService.getCategoryList('income');
        if (categoryList && categoryList.categories) {
            const categories = categoryList.categories;
            this.createCategories(categories);
            this.createEmptyCategory();
            this.btnCreateIncomeCategory = document.getElementById("btnCreateIncome");
            this.btnCreateIncomeCategory.addEventListener('click', this.btnCreateIncomeCategoryClick.bind(this));
            this.initEditButtons();
            this.categoryIdToDelete = null;
            this.categoryIdToEdit = null
            this.deleteModalElement = document.getElementById('deleteModal');
            this.deleteModal = new bootstrap.Modal(this.deleteModalElement);
            this.btnConfirmDelete = document.getElementById("btnConfirmDelete");
            this.btnConfirmDelete.addEventListener('click', this.btnConfirmDeleteClick.bind(this));
            this.initDeleteButtons();
        }

    }

    createCategories(categories) {
        for (const category of categories) {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('col-12', 'col-lg-6', 'col-xl-4');
            categoryElement.innerHTML = `<div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h4 class="card-title fw-bold text-primary-emphasis">` + category.title + `</h4>
                        <div class="mt-3">
                            <button class="btn btn-primary me-2 btnEdit" data-id="` + category.id + `">Редактировать</button>
                            <button class="btn btn-danger btnDelete" data-id="` + category.id + `">Удалить</button>
                        </div>
                    </div>
                </div>`;
            this.parentElement.appendChild(categoryElement);
        }
    }

    createEmptyCategory() {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('col-12', 'col-lg-6', 'col-xl-4');
        categoryElement.innerHTML = ` <div class="card h-100 shadow-sm cursor-pointer" role="button" id="btnCreateIncome">
                    <div class="card-body d-flex align-items-center justify-content-center ">
                    <div class="text-center text-body-tertiary fs-1">+</div>
                    </div>
                </div>`;
        this.parentElement.appendChild(categoryElement);
    }

    btnCreateIncomeCategoryClick(e) {
        e.preventDefault();
        return this.openNewRoute('/create-income');
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
        return this.openNewRoute('/edit-income?id=' + this.categoryIdToEdit);
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
        //здесь удаление категории
        return this.openNewRoute('/delete-income?id=' + this.categoryIdToDelete);

    }
}
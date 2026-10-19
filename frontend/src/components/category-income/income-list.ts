import * as bootstrap from "bootstrap";
import {CategoryService} from "../../services/category-service";
import type {CategoriesResult, Category} from "../../types/categories.type";

export class IncomeList {
    readonly openNewRoute: (route: string) => void;
    readonly parentElement: HTMLElement | null = null;
    private categoryIdToDelete: string | null = null;
    private categoryIdToEdit: string | null = null;
    private deleteModal: InstanceType<typeof bootstrap.Modal> | null = null;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;
        this.parentElement = document.getElementById('income-container');
        //получаем список категорий
        this.getCategoryList().then();

    }

    private async getCategoryList(): Promise<void> {
        const categoryList: CategoriesResult = await CategoryService.getCategoryList('income');
        if (categoryList && categoryList.categories) {
            const categories: Category[] = categoryList.categories;
            this.createCategories(categories);
            this.createEmptyCategory();
            const btnCreateIncomeCategory: HTMLElement | null = document.getElementById("btnCreateIncome");
            if (btnCreateIncomeCategory) {
                btnCreateIncomeCategory.addEventListener('click', this.btnCreateIncomeCategoryClick.bind(this));
            }
            this.initEditButtons();
            this.categoryIdToDelete = null;
            this.categoryIdToEdit = null;
            const deleteModalElement: HTMLElement | null = document.getElementById('deleteModal');
            this.deleteModal = new bootstrap.Modal(deleteModalElement);
            const btnConfirmDelete: HTMLElement | null = document.getElementById("btnConfirmDelete");
            if (btnConfirmDelete) {
                btnConfirmDelete.addEventListener('click', this.btnConfirmDeleteClick.bind(this));
            }
            this.initDeleteButtons();
        }

    }

    private createCategories(categories: Category[]): void {
        const parentElement: HTMLElement | null = this.parentElement;
        if (parentElement) {
            for (const category of categories) {
                const categoryElement: HTMLDivElement = document.createElement('div');
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
                parentElement.appendChild(categoryElement);
            }
        }
    }

    private createEmptyCategory(): void {
        const parentElement: HTMLElement | null = this.parentElement;
        if (parentElement) {
            const categoryElement:HTMLDivElement = document.createElement('div');
            categoryElement.classList.add('col-12', 'col-lg-6', 'col-xl-4');
            categoryElement.innerHTML = ` <div class="card h-100 shadow-sm cursor-pointer" role="button" id="btnCreateIncome">
                    <div class="card-body d-flex align-items-center justify-content-center ">
                    <div class="text-center text-body-tertiary fs-1">+</div>
                    </div>
                </div>`;
            parentElement.appendChild(categoryElement);
        }
    }

    private btnCreateIncomeCategoryClick(e:Event):void {
        e.preventDefault();
        return this.openNewRoute('/create-income');
    }

   private initEditButtons():void {
        document.querySelectorAll('.btnEdit').forEach(link => {
            link.removeEventListener('click', this.handleEditClick);
            link.addEventListener('click', this.handleEditClick.bind(this));
        });
    }

    private handleEditClick(e:Event):void {
        e.preventDefault();
        const target: HTMLElement = e.currentTarget as HTMLElement;
        this.categoryIdToEdit = target.getAttribute('data-id');
        return this.openNewRoute('/edit-income?id=' + this.categoryIdToEdit);
    }

    private initDeleteButtons():void {
        document.querySelectorAll('.btnDelete').forEach(link => {
            link.removeEventListener('click', this.handleDeleteClick);
            link.addEventListener('click', this.handleDeleteClick.bind(this));
        });
    }

    private handleDeleteClick(e:Event):void {
        e.preventDefault();
        const target: HTMLElement = e.currentTarget as HTMLElement;
        this.categoryIdToDelete = target.getAttribute('data-id');
        this.deleteModal.show();

    }

    private btnConfirmDeleteClick(e:Event):void {
        e.preventDefault();
        this.deleteModal.hide();
        //здесь удаление категории
        return this.openNewRoute('/delete-income?id=' + this.categoryIdToDelete);

    }
}
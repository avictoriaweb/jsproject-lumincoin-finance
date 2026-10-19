import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {TransactionsService} from "../../services/transactions-service";
import type {CategoriesResult, Category} from "../../types/categories.type";
import type {Transaction, TransactionResult} from "../../types/transactions.type";
import type {ValidationsType} from "../../types/validations.type";

export class CreateTransaction {
    readonly openNewRoute: (route: string) => void;
    private type: string = '';
    readonly typeSelect: HTMLElement | null = null;
    readonly categorySelect: HTMLSelectElement | null = null;
    readonly amountInput: HTMLInputElement | null = null;
    readonly dateInput: HTMLInputElement | null = null;
    readonly commentInput: HTMLInputElement | null = null;
    readonly datePicker: HTMLElement | null = null;
    readonly btnSave: HTMLElement | null = null;
    readonly btnCancel: HTMLElement | null = null;
    readonly validations: ValidationsType[] = [];

    constructor(openNewRoute: (route: string) => void) {

        this.openNewRoute = openNewRoute;
        const type: string | null = UrlUtils.getUrlParam('type');
        if (!type) {
            this.openNewRoute('/');
            return;
        }
        this.type = type;
        //находим все поля формы
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
        this.amountInput = document.getElementById('amount') as HTMLInputElement;
        this.dateInput = document.getElementById('date') as HTMLInputElement;
        this.commentInput = document.getElementById('comment') as HTMLInputElement;

//заполняем селекты
        this.initFormFields().then();

        this.datePicker = document.getElementById("date");
        this.initDatePicker();
        this.btnSave = document.getElementById("btnSave");
        if (this.btnSave)
            this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        if (this.btnCancel)
            this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));

        this.validations = [
            {element: this.amountInput, options: {pattern: /^\d+([.,]\d{1,2})?$/}},
            {element: this.dateInput},
            {element: this.commentInput},

        ];

        //событие переключения типа операции
        if (this.typeSelect)
            this.typeSelect.addEventListener('change', (e: Event): void => {
                if (e.target) {
                    this.type = (e.target as HTMLSelectElement).value;
                    this.initFormFields().then();
                }
            });
    }

    private async initFormFields(): Promise<void> {
        let pageTitleElement: HTMLElement | null = document.getElementById('page-title');
        if (pageTitleElement) {
            pageTitleElement.innerText = `Создание ${this.type === 'income' ? 'дохода' : 'расхода'}`;
        }

        if (this.typeSelect)
            (this.typeSelect as HTMLSelectElement).value = this.type;

        if (this.categorySelect) {
            (this.categorySelect as HTMLSelectElement).options.length = 0; //удаляем опции

            const categoriesList: CategoriesResult = await CategoryService.getCategoryList(this.type);
            if (categoriesList && categoriesList.categories) {
                const categories: Category[] = categoriesList.categories;
                categories.forEach(category => {
                    const option: HTMLOptionElement = document.createElement('option');
                    option.value = category.id?.toString() ?? '';
                    option.innerText = category.title;
                    this.categorySelect!.appendChild(option);
                });
            }
        }

    }

    private initDatePicker(): void {
        if (this.datePicker) {
            this.datePicker.removeEventListener('click', this.handleDateClick);
            this.datePicker.addEventListener('click', this.handleDateClick);
        }
    }

    private handleDateClick(e: Event): void {
        e.preventDefault();
        const dateElement: HTMLElement | null = e.currentTarget as HTMLElement;
        if (dateElement) {
            const targetId: string | null = dateElement.getAttribute('data-target');
            if (targetId) {
                const dateInput: HTMLInputElement | null = document.getElementById(targetId) as HTMLInputElement;
                if (dateInput) {
                    // Получаем текущую дату в формате YYYY-MM-DD
                    const today: string | undefined = new Date().toISOString().split('T')[0];
                    if (today) {
                        // Устанавливаем максимальную допустимую дату
                        dateInput.setAttribute('max', today);
                        dateInput.showPicker();
                        dateInput.addEventListener('change', (event: Event) => {
                            const target: HTMLInputElement | null = event.target as HTMLInputElement;
                            if (target) {
                                const selectedDate: string = target.value; // Получим строку "YYYY-MM-DD"
                                dateElement.innerText = selectedDate ? selectedDate : "Дата";
                            }
                        }, {once: true});
                    }
                } else {
                    console.error('Date input not found:', targetId);
                }
            }
        }

    }

    private async btnSaveClick(e: Event): Promise<void | null> {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const amountValue: string = this.amountInput ? this.amountInput.value : '';
            const dateValue: string = this.dateInput ? this.dateInput.value : '';
            const categoryIdValue: number = this.categorySelect ? parseInt(this.categorySelect.value) : 0;
            const commentValue: string = this.commentInput ? this.commentInput.value : '';

           const createData: Transaction = {
                type: this.type,
                amount: amountValue,
                date: dateValue,
                comment: commentValue,
                category_id: categoryIdValue,
            };
            const response: TransactionResult = await TransactionsService.createTransaction(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/transactions');
        }

    }

    private btnCancelClick(e:Event):void {
        e.preventDefault();
        return this.openNewRoute('/transactions');
    }
}
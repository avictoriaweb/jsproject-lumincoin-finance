import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import {TransactionsService} from "../../services/transactions-service";
import {ValidationUtils} from "../../utils/validation-utils";
import type {Transaction, TransactionResult} from "../../types/transactions.type";
import type {CategoriesResult, Category} from "../../types/categories.type";
import type {ValidationsType} from "../../types/validations.type";

export class EditTransaction {
    readonly openNewRoute: (route: string) => void;
    readonly id: string = '';

    readonly typeSelect: HTMLSelectElement | null = null;
    readonly categorySelect: HTMLSelectElement | null = null;
    readonly amountInputElement: HTMLInputElement | null = null;
    readonly dateInputElement: HTMLInputElement | null = null;
    readonly commentInputElement: HTMLInputElement | null = null;
    readonly datePicker: HTMLElement | null = null;
    readonly btnSave: HTMLElement | null = null;
    readonly btnCancel: HTMLElement | null = null;
    readonly validations: ValidationsType[] = [];
    private type: string = '';

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }
        this.id = id;

        //находим все поля формы
        this.typeSelect = document.getElementById('typeSelect') as HTMLSelectElement;
        this.categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
        this.amountInputElement = document.getElementById('amount') as HTMLInputElement;
        this.dateInputElement = document.getElementById('date') as HTMLInputElement;
        this.commentInputElement = document.getElementById('comment') as HTMLInputElement;

        this.init(id).then();

        this.datePicker = document.getElementById("date");
        this.initDatePicker();
        this.btnSave = document.getElementById("btnSave");
        if (this.btnSave) {
            this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        }
        this.btnCancel = document.getElementById("btnCancel");
        if (this.btnCancel) {
            this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));
        }

        this.validations = [
            {element: this.amountInputElement, options: {pattern: /^\d+([.,]\d{1,2})?\$?$/}},
            {element: this.dateInputElement},
            {element: this.commentInputElement},
        ];
    }

    private async init(id: string): Promise<void> {
        const result: TransactionResult = await TransactionsService.getTransaction(id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
        }
        if (result.transaction) {
            this.type = result.transaction.type;
            if (this.typeSelect) {
                this.typeSelect.value = this.type;
            }
            const pageTitleElement: HTMLElement = document.getElementById('pageTitle') as HTMLElement;
            pageTitleElement.innerText = `Редактирование ${this.type === 'income' ? 'дохода' : 'расхода'}`;

            if (this.categorySelect) {
                this.categorySelect.options.length = 0; //удаляем опции
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

            if (this.amountInputElement) {
                this.amountInputElement.value = result.transaction.amount + '$';
                this.amountFieldInputFormatting();
            }
            if (this.dateInputElement) {
                this.dateInputElement.value = result.transaction.date;
            }
            if (this.commentInputElement) {
                this.commentInputElement.value = result.transaction.comment ? result.transaction.comment : '';
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
                        dateInput.value = (dateElement as HTMLInputElement).value;

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
            const amountValue: string = this.amountInputElement ? this.amountInputElement.value.replace(/[^\d.]/g, '') : '';
            const dateValue: string = this.dateInputElement ? this.dateInputElement.value : '';
            const categoryIdValue: number = this.categorySelect ? parseInt(this.categorySelect.value) : 0;
            const commentValue: string = this.commentInputElement ? this.commentInputElement.value : '';

            const editData: Transaction = {
                type: this.type,
                amount: amountValue,
                date: dateValue,
                comment: commentValue,
                category_id: categoryIdValue,
            };

            const response: TransactionResult = await TransactionsService.editTransaction(this.id, editData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/transactions');
        }

    }

    private btnCancelClick(e: Event): void {
        e.preventDefault();
        return this.openNewRoute('/transactions');
    }

    private amountFieldInputFormatting(): void {
        if (this.amountInputElement) {
            //настраиваем поле amount. при потере фокуса добавляем знак $
            // При получении фокуса: убираем "$" и пробелы
            this.amountInputElement.addEventListener('focus', (e:FocusEvent) => {
                const targetElement: HTMLInputElement | null = e.target as HTMLInputElement;
                const value:string = targetElement.value;
                // Оставляем только цифры и точку/запятую
                targetElement.value = value.replace(/[^\d.,]/g, '');
            });

// При потере фокуса: добавляем "$" обратно
            this.amountInputElement.addEventListener('blur', (e:FocusEvent) => {
                const targetElement: HTMLInputElement | null = e.target as HTMLInputElement;
                const value:string = targetElement.value.trim();

                if (value !== '') {
                    // Форматируем: добавляем знак $ (можно добавить и разделение тысяч)
                    targetElement.value = `${value}$`;
                }
            });
        }

    }
}
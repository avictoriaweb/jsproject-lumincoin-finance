import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {TransactionsService} from "../../services/transactions-service";

export class CreateTransaction {
    constructor(openNewRoute) {


        this.openNewRoute = openNewRoute;
        const type = UrlUtils.getUrlParam('type');
        if (!type) {
            return this.openNewRoute('/');
        }
        this.type = type;
        //находим все поля формы
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.amountInput = document.getElementById('amount');
        this.dateInput = document.getElementById('date');
        this.commentInput = document.getElementById('comment');

//заполняем селекты
        this.initFormFields().then();

        this.datePicker = document.getElementById("date");
        this.initDatePicker();
        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));

        this.validations = [
            {element: this.amountInput, options: {pattern: /^\d+([.,]\d{1,2})?$/}},
            {element: this.dateInput},
            {element: this.commentInput},

        ];

        //событие переключения типа операции
        this.typeSelect.addEventListener('change', (e) => {
            this.type = e.target.value;
            this.initFormFields().then();
        });
    }

    async initFormFields() {
        document.getElementById('page-title').innerText = `Создание ${this.type === 'income' ? 'дохода' : 'расхода'}`;

        this.typeSelect.value = this.type;

        this.categorySelect.options.length = 0; //удаляем опции
        const categoriesList = await CategoryService.getCategoryList(this.type);
        if (categoriesList && categoriesList.categories) {
            const categories = categoriesList.categories;
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.innerText = category.title;
                this.categorySelect.appendChild(option);
            });
        }

    }

    initDatePicker() {
        this.datePicker.removeEventListener('click', this.handleDateClick);
        this.datePicker.addEventListener('click', this.handleDateClick);
    }

    handleDateClick(e) {
        e.preventDefault();
        const dateElement = e.currentTarget;
        const targetId = e.currentTarget.getAttribute('data-target');
        const dateInput = document.getElementById(targetId);

        if (dateInput) {
            // Получаем текущую дату в формате YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];

            // Устанавливаем максимальную допустимую дату
            dateInput.setAttribute('max', today);
            dateInput.showPicker();
            dateInput.addEventListener('change', (event) => {
                const selectedDate = event.target.value; // Получим строку "YYYY-MM-DD"
                dateElement.value = selectedDate;

            }, {once: true});
        } else {
            console.error('Date input not found:', targetId);
        }
    }

    async btnSaveClick(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {

            const createData = {
                type: this.type,
                amount: this.amountInput.value,
                date: this.dateInput.value,
                comment: this.commentInput.value,
                category_id:parseInt(this.categorySelect.value),
            };
            const response = await TransactionsService.createTransaction(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/transactions');
        }

    }

    btnCancelClick(e) {
        e.preventDefault();
        return this.openNewRoute('/transactions');
    }
}
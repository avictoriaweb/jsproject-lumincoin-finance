import {UrlUtils} from "../../utils/url-utils";
import {CategoryService} from "../../services/category-service";
import {TransactionsService} from "../../services/transactions-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class EditTransaction {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.id = id;

        //находим все поля формы
        this.typeSelect = document.getElementById('typeSelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');

        this.init(id).then();

        this.datePicker = document.getElementById("date");
        this.initDatePicker();
        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener('click', this.btnSaveClick.bind(this));
        this.btnCancel = document.getElementById("btnCancel");
        this.btnCancel.addEventListener('click', this.btnCancelClick.bind(this));

        this.validations = [
            {element: this.amountInputElement, options: {pattern: /^\d+([.,]\d{1,2})?\$?$/}},
            {element: this.dateInputElement},
            {element: this.commentInputElement},
        ];
    }

    async init(id) {
        const result = await TransactionsService.getTransaction(id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
        }
       this.type = result.transaction.type;

        this.typeSelect.value = this.type;
        document.getElementById('page-title').innerText = `Редактирование ${this.type === 'income' ? 'дохода' : 'расхода'}`;

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

        this.amountInputElement.value = result.transaction.amount + '$';
        this.amountFieldInputFormatting();
        this.dateInputElement.value = result.transaction.date;
        this.commentInputElement.value = result.transaction.comment;


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
            dateInput.value = e.currentTarget.value;

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

            const editData = {
                type: this.type,
                amount: this.amountInputElement.value.replace(/[^\d.]/g, ''),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelect.value),
            };
            const response = await TransactionsService.editTransaction(this.id, editData);
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

    amountFieldInputFormatting(){

        //настраиваем поле amount. при потере фокуса добавляем знак $
        // При получении фокуса: убираем "$" и пробелы
        this.amountInputElement.addEventListener('focus', (e) => {
            const value = e.target.value;
            // Оставляем только цифры и точку/запятую
            e.target.value = value.replace(/[^\d.,]/g, '');
        });

// При потере фокуса: добавляем "$" обратно
        this.amountInputElement.addEventListener('blur', (e) => {
            const value = e.target.value.trim();

            if (value !== '') {
                // Форматируем: добавляем знак $ (можно добавить и разделение тысяч)
                e.target.value = `${value}$`;
            }
        });


    }
}
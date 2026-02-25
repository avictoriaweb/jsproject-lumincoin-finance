import * as bootstrap from 'bootstrap';
import {TransactionsService} from "../../services/transactions-service";
import {DateUtils} from "../../utils/date-utils";
import {BalanceService} from "../../services/balance-service";

export class Transactions {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentPeriod = 'today';
        //получаем список транзакций
        this.getTransactionsList(this.currentPeriod).then();
        this.initButtons();
    }

    async getTransactionsList(period) {
        let date1 = null;
        let date2 = null;
        if (period === "interval") {
            //если выбран интервал, то получаем даты
            const dateFromElement = document.getElementById('dateFromLink');
            const dateToElement = document.getElementById('dateToLink');
            if (dateFromElement.innerText === "Дата") {
                alert("Введите дату начала периода");
                return;
            } else date1 = dateFromElement.innerText;
            if (dateToElement.innerText === "Дата") {
                alert("Введите дату окончания периода");
                return;
            } else date2 = dateToElement.innerText;
        }

        const transactionsList = await TransactionsService.getTransactionsList(period, date1, date2);
        if (transactionsList.redirect) {
            return this.openNewRoute(transactionsList.redirect);
        }
        if (transactionsList && transactionsList.transactions) {
            this.createTransactionsTable(transactionsList.transactions);
            this.initDeleteButtons();

        }

    }

    createTransactionsTable(transactions) {
        const recordsElement = document.getElementById('records-container');
        recordsElement.innerHTML = '';
        for (let i = 0; i < transactions.length; i++) {
            const trElement = document.createElement('tr');

            const th = document.createElement('th');
            th.textContent = i + 1;
            th.scope = 'col';
            trElement.appendChild(th);

            const typeCell = document.createElement('td');
            typeCell.textContent = transactions[i].type === 'income' ? 'доход' : 'расход';
            typeCell.className = transactions[i].type === 'income' ? 'text-success' : 'text-danger';
            trElement.appendChild(typeCell);

            trElement.insertCell().innerText = transactions[i].category ? transactions[i].category : "Без категории";

            trElement.insertCell().innerText = transactions[i].amount + '$';

            trElement.insertCell().innerText = DateUtils.formatDateForTransactionsTable(transactions[i].date);

            trElement.insertCell().innerText = transactions[i].comment;

            trElement.insertCell().innerHTML = `
  <div class="d-flex justify-content-center gap-1">
    <button class="btn py-0 btnDelete" data-id="${transactions[i].id}">
      <i class="bi bi-trash3"></i>
    </button>
    <a href="/edit-transaction?id=${transactions[i].id}" class="btn py-0">
      <i class="bi bi-pencil"></i>
    </a>
  </div>
`;


            recordsElement.appendChild(trElement);
        }
    }

    initButtons() {
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
        //настраиваем фильтр записей
        document.querySelectorAll('.btn-period').forEach(link => {
            link.addEventListener('click', this.handlePeriodClick.bind(this));
        });
    }

    initDatePickers() {
        document.querySelectorAll('.date-link').forEach(link => {
            link.addEventListener('click', this.handleDateClick);
        });
    }

    initDeleteButtons() {
        document.querySelectorAll('.btnDelete').forEach(link => {
            link.addEventListener('click', this.handleDeleteClick.bind(this));
        });
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
                dateElement.innerText = selectedDate ? selectedDate : "Дата";
            }, {once: true});
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
        return this.openNewRoute('/create-transaction?type=income');
    }

    btnCreateExpenseClick(e) {
        e.preventDefault();
        return this.openNewRoute('/create-transaction?type=expense');
    }

    async btnConfirmDeleteClick(e) {
        e.preventDefault();
        const result = await TransactionsService.deleteTransaction(this.transactionIdToDelete);
        if (result && !result.error) {
            this.deleteModal.hide();
            //перерисовываем таблицу
            await this.getTransactionsList(this.currentPeriod);
            //обновляем счетчик баланса
            const balanceElement = document.getElementById('balance');
            const balance = await BalanceService.getBalance();
            balanceElement.innerText = balance.balance.balance + '$';
        } else {
            alert("Ошибка при удалении");
        }


    }

    handlePeriodClick(e) {
        e.preventDefault();
        const activePeriodBtnElement = e.currentTarget;
        this.currentPeriod = activePeriodBtnElement.getAttribute('data-period');
        this.getTransactionsList(this.currentPeriod).then();

        // применяем стили
        const allButtons = document.getElementsByClassName('btn-period');
        for (let i = 0; i < allButtons.length; i++) {
            allButtons[i].classList.remove('btn-secondary');
            allButtons[i].classList.add('btn-outline-secondary');
        }
        activePeriodBtnElement.classList.add('btn-secondary');
        activePeriodBtnElement.classList.remove('btn-outline-secondary');
    }

}
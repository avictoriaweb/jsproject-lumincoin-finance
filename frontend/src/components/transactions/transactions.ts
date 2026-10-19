import * as bootstrap from 'bootstrap';
import {TransactionsService} from "../../services/transactions-service";
import {DateUtils} from "../../utils/date-utils";
import {BalanceService} from "../../services/balance-service";
import type {Transaction, TransactionsResult} from "../../types/transactions.type";
import type {BalanceType} from "../../types/balance.type";

export class Transactions {
    readonly openNewRoute: (route: string) => void;
    private currentPeriod: string = 'today';

    private btnCreateIncome: HTMLElement | null = null;
    private btnCreateExpense: HTMLElement | null = null;
    private transactionIdToDelete: string | null = null;
    private deleteModalElement: HTMLElement | null = null;
    private deleteModal: InstanceType<typeof bootstrap.Modal> | null = null;
    private btnConfirmDelete: HTMLElement | null = null;

    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;

        //получаем список транзакций
        this.getTransactionsList(this.currentPeriod).then();
        this.initButtons();
    }

    private async getTransactionsList(period: string): Promise<TransactionsResult | void> {
        let date1: string | null = null;
        let date2: string | null = null;
        if (period === "interval") {
            //если выбран интервал, то получаем даты
            const dateFromElement: HTMLElement | null = document.getElementById('dateFromLink');
            const dateToElement: HTMLElement | null = document.getElementById('dateToLink');
            if (dateFromElement) {
                if (dateFromElement.innerText === "Дата") {
                    alert("Введите дату начала периода");
                    return;
                } else date1 = dateFromElement.innerText;
                if (dateToElement) {
                    if (dateToElement.innerText === "Дата") {
                        alert("Введите дату окончания периода");
                        return;
                    } else date2 = dateToElement.innerText;
                }
            }
        }

        const transactionsList: TransactionsResult = await TransactionsService.getTransactionsList(period, date1, date2);
        if (transactionsList.redirect) {
            return this.openNewRoute(transactionsList.redirect);
        }
        if (transactionsList && transactionsList.transactions) {
            this.createTransactionsTable(transactionsList.transactions);
            this.initDeleteButtons();

        }

    }

    private createTransactionsTable(transactions: Transaction[]) {
        const recordsElement: HTMLElement | null = document.getElementById('records-container');
        if (recordsElement) {
            recordsElement.innerHTML = '';
            for (let i = 0; i < transactions.length; i++) {
                const transaction: Transaction | undefined = transactions[i];
                if (transaction) {
                    const trElement: HTMLTableRowElement = document.createElement('tr');

                    const th: HTMLTableCellElement = document.createElement('th');
                    th.textContent = (i + 1).toString();
                    th.scope = 'col';
                    trElement.appendChild(th);

                    const typeCell: HTMLTableCellElement = document.createElement('td');
                    typeCell.textContent = transaction.type === 'income' ? 'доход' : 'расход';
                    typeCell.className = transaction.type === 'income' ? 'text-success' : 'text-danger';
                    trElement.appendChild(typeCell);

                    trElement.insertCell().innerText = transaction.category ? transaction.category : "Без категории";

                    trElement.insertCell().innerText = transaction.amount + '$';

                    let dateForTable: string | undefined = DateUtils.formatDateForTransactionsTable(transaction.date);
                    trElement.insertCell().innerText = dateForTable ? dateForTable : '';

                    trElement.insertCell().innerText = transaction.comment ? transaction.comment : '';

                    trElement.insertCell().innerHTML = `
  <div class="d-flex justify-content-center gap-1">
    <button class="btn py-0 btnDelete" data-id="${transaction.id}">
      <i class="bi bi-trash3"></i>
    </button>
    <a href="/edit-transaction?id=${transaction.id}" class="btn py-0">
      <i class="bi bi-pencil"></i>
    </a>
  </div>
`;


                    recordsElement.appendChild(trElement);
                }
            }
        }
    }

    private initButtons(): void {
        this.initDatePickers();
        this.btnCreateIncome = document.getElementById("btnCreateIncome");
        if (this.btnCreateIncome) {
            this.btnCreateIncome.addEventListener('click', this.btnCreateIncomeClick.bind(this));
        }
        this.btnCreateExpense = document.getElementById("btnCreateExpense");
        if (this.btnCreateExpense) {
            this.btnCreateExpense.addEventListener('click', this.btnCreateExpenseClick.bind(this));
        }
        this.transactionIdToDelete = null;
        this.deleteModalElement = document.getElementById('deleteModal');
        if (this.deleteModalElement) {
            this.deleteModal = new bootstrap.Modal(this.deleteModalElement);
        }
        this.btnConfirmDelete = document.getElementById("btnConfirmDelete");
        if (this.btnConfirmDelete) {
            this.btnConfirmDelete.addEventListener('click', this.btnConfirmDeleteClick.bind(this));
        }
        this.initDeleteButtons();
        //настраиваем фильтр записей
        document.querySelectorAll('.btn-period').forEach(link => {
            link.addEventListener('click', this.handlePeriodClick.bind(this));
        });
    }

    private initDatePickers(): void {
        document.querySelectorAll('.date-link').forEach(link => {
            link.addEventListener('click', this.handleDateClick);
        });
    }

    private initDeleteButtons(): void {
        document.querySelectorAll('.btnDelete').forEach(link => {
            link.addEventListener('click', this.handleDeleteClick.bind(this));
        });
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
                                const selectedDate = target.value; // Получим строку "YYYY-MM-DD"
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

    private handleDeleteClick(e: Event): void {
        e.preventDefault();
        const target: HTMLElement = e.currentTarget as HTMLElement;
        this.transactionIdToDelete = target.getAttribute('data-id');
        this.deleteModal.show();

    }

    private btnCreateIncomeClick(e: Event): void {
        e.preventDefault();
        return this.openNewRoute('/create-transaction?type=income');
    }

    private btnCreateExpenseClick(e: Event): void {
        e.preventDefault();
        return this.openNewRoute('/create-transaction?type=expense');
    }

    private async btnConfirmDeleteClick(e: Event): Promise<void> {
        e.preventDefault();
        if (this.transactionIdToDelete) {
            const result: TransactionsResult = await TransactionsService.deleteTransaction(this.transactionIdToDelete);
            if (result && !result.error) {
                this.deleteModal.hide();
                //перерисовываем таблицу
                await this.getTransactionsList(this.currentPeriod);
                //обновляем счетчик баланса
                const balanceElement: HTMLElement | null = document.getElementById('balance');
                const balance: BalanceType = await BalanceService.getBalance();
                if (balanceElement) {
                    if (balance.balance) {
                        balanceElement.innerText = balance.balance.balance + '$';
                    }
                }
            } else {
                alert("Ошибка при удалении");
            }
        }

    }

    private handlePeriodClick(e: Event): void {
        e.preventDefault();
        const activePeriodBtnElement: HTMLElement | null = e.currentTarget as HTMLElement;
        if (activePeriodBtnElement) {
            const period: string | null = activePeriodBtnElement.getAttribute('data-period');
            if (period) {
                this.currentPeriod = period;
                this.getTransactionsList(this.currentPeriod).then();

                // применяем стили
                const allButtons: HTMLCollectionOf<Element> = document.getElementsByClassName('btn-period');
                for (let i = 0; i < allButtons.length; i++) {
                    const button: Element | undefined = allButtons[i];
                    if (button) {
                        button.classList.remove('btn-secondary');
                        button.classList.add('btn-outline-secondary');
                    }
                }
                activePeriodBtnElement.classList.add('btn-secondary');
                activePeriodBtnElement.classList.remove('btn-outline-secondary');
            }
        }
    }

}
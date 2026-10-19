import * as bootstrap from "bootstrap";
import {Chart, type ChartConfiguration} from 'chart.js/auto';
import {TransactionsService} from "../services/transactions-service";
import config from "../config/config";
import type {Transaction, TransactionsResult} from "../types/transactions.type";

export class Dashboard {
    readonly openNewRoute: (route: string) => void;
    private incomeChart: Chart | null;
    private expenseChart: Chart | null;
    readonly ctx1: HTMLCanvasElement | null;
    readonly ctx2: HTMLCanvasElement | null;


    constructor(openNewRoute: (route: string) => void) {
        this.openNewRoute = openNewRoute;
        this.incomeChart = null;
        this.expenseChart = null;
        this.ctx1 = document.getElementById('incomeChart') as HTMLCanvasElement;
        this.ctx2 = document.getElementById('expenseChart') as HTMLCanvasElement;

        //получаем список транзакций
        this.getTransactionsList().then();
        this.initDatePickers();
        //настраиваем фильтр записей
        document.querySelectorAll('.btn-period').forEach(link => {
            link.addEventListener('click', this.handlePeriodClick.bind(this));
        });

    }

    private async getTransactionsList(period?: string | null): Promise<void> {
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
            }
            if (dateToElement) {
                if (dateToElement.innerText === "Дата") {
                    alert("Введите дату окончания периода");
                    return;
                } else date2 = dateToElement.innerText;
            }
        }

        const transactionsList: TransactionsResult = await TransactionsService.getTransactionsList(period, date1, date2);
        if (transactionsList.redirect) {
            return this.openNewRoute(transactionsList.redirect);
        }
        if (transactionsList && transactionsList.transactions) {
            this.initCharts(transactionsList.transactions);
        }

    }


    private initDatePickers(): void {
        document.querySelectorAll('.date-link').forEach(link => {
            link.addEventListener('click', this.handleDateClick);
        });
    }

    private handleDateClick(e: Event) {
        e.preventDefault();
        const dateElement: EventTarget | null = e.currentTarget;
        let targetId: string | null = null;
        let dateInput: HTMLInputElement | null = null;
        if (dateElement) {
            targetId = (dateElement as HTMLInputElement).getAttribute('data-target');
            if (targetId) {
                dateInput = document.getElementById(targetId) as HTMLInputElement;
            }
        }
        if (dateInput) {
            // Получаем текущую дату в формате YYYY-MM-DD
            const today: string | undefined = new Date().toISOString().split('T')[0];
            if (today) {
                // Устанавливаем максимальную допустимую дату
                dateInput.setAttribute('max', today);
                dateInput.showPicker();
                dateInput.addEventListener('change', (event: Event): void => {
                    if (event.target) {
                        const selectedDate: string = (event.target as HTMLInputElement).value; // Получим строку "YYYY-MM-DD"
                        (dateElement as HTMLInputElement).innerText = selectedDate ? selectedDate : "Дата";
                    }
                }, {once: true});
            }
        } else {
            console.error('Date input not found:', targetId);
        }
    }

    private handlePeriodClick(e: Event): void {
        e.preventDefault();
        const activePeriodBtnElement: HTMLButtonElement | null = e.currentTarget as HTMLButtonElement;
        if (activePeriodBtnElement) {
            const period: string | null = activePeriodBtnElement.getAttribute('data-period');
            this.getTransactionsList(period).then();

            // 1. Находим всех "соседей" (все кнопки в этом же контейнере)
            const allButtons: HTMLCollectionOf<Element> = document.getElementsByClassName('btn-period');

            // 2. Сбрасываем все кнопки в состояние "outline"
            for (let i: number = 0; i < allButtons.length; i++) {
                allButtons[i]?.classList.remove('btn-secondary');
                allButtons[i]?.classList.add('btn-outline-secondary');
            }

            // 3. Делаем текущую кнопку активной
            activePeriodBtnElement.classList.add('btn-secondary');
            activePeriodBtnElement.classList.remove('btn-outline-secondary');
        }
    }

    private initCharts(transactions: Transaction[]): void {
        const income: Transaction[] = transactions.filter((t: Transaction) => t.type === 'income');
        const expense: Transaction[] = transactions.filter((t: Transaction) => t.type === 'expense');
        const incomeCategories: {} = this.getCategoriesForChart(income);
        const expenseCategories: {} = this.getCategoriesForChart(expense);

        if (this.incomeChart) {
            this.incomeChart.destroy();
        }
        if (this.ctx1)
            this.incomeChart = this.initChart(incomeCategories, this.ctx1);

        if (this.expenseChart) {
            this.expenseChart.destroy();
        }
        if (this.ctx2)
            this.expenseChart = this.initChart(expenseCategories, this.ctx2);

    }

    private getCategoriesForChart(categories: Transaction[]): Record<string, number> {
        if (categories)
            return categories.reduce<Record<string, number>>((acc, curr) => {
                const category: string = curr.category ? curr.category : "Без категории";

                const amount: number = parseFloat(curr.amount as string);

                acc[category] = (acc[category] || 0) + amount;
                return acc;
            }, {} as Record<string, number>);
        else return {};
    }

    private initChart(chartData:  Record<string, number>, ctx: HTMLCanvasElement): Chart {
        const labels: string[] = Object.keys(chartData);
        const amounts: number[] = Object.values(chartData);
        const CHART_COLORS: string[] = config.chartColors;
        const data = {
            labels: labels,
            datasets: [{
                //  label: 'Dataset 1',
                data: amounts,
                radius: '80%',
                backgroundColor: CHART_COLORS.slice(0, labels.length),
            }]
        };

        const configChart: ChartConfiguration<'pie'> = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {position: 'top'},
                }
            },
        };
        return new Chart(ctx, configChart);

    }
}
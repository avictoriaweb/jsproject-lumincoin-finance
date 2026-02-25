import * as bootstrap from "bootstrap";
import Chart from 'chart.js/auto';
import {TransactionsService} from "../services/transactions-service";
import config from "../config/config";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeChart = null;
        this.expenseChart = null;
        this.ctx1 = document.getElementById('incomeChart');
        this.ctx2 = document.getElementById('expenseChart');

        //получаем список транзакций
        this.getTransactionsList().then();
        this.initDatePickers();
        //настраиваем фильтр записей
        document.querySelectorAll('.btn-period').forEach(link => {
            link.addEventListener('click', this.handlePeriodClick.bind(this));
        });

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
            this.initCharts(transactionsList.transactions);

        }

    }


    initDatePickers() {
        document.querySelectorAll('.date-link').forEach(link => {
            link.addEventListener('click', this.handleDateClick);
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

    handlePeriodClick(e) {
        e.preventDefault();
        const activePeriodBtnElement = e.currentTarget;
        const period = activePeriodBtnElement.getAttribute('data-period');
        this.getTransactionsList(period).then();

        // 1. Находим всех "соседей" (все кнопки в этом же контейнере)
        const allButtons = document.getElementsByClassName('btn-period');

        // 2. Сбрасываем все кнопки в состояние "outline"
        for (let i = 0; i < allButtons.length; i++) {
            allButtons[i].classList.remove('btn-secondary');
            allButtons[i].classList.add('btn-outline-secondary');
        }

        // 3. Делаем текущую кнопку активной
        activePeriodBtnElement.classList.add('btn-secondary');
        activePeriodBtnElement.classList.remove('btn-outline-secondary');
    }

    initCharts(transactions) {
        const income = transactions.filter(t => t.type === 'income');
        const expense = transactions.filter(t => t.type === 'expense');
        const incomeCategories = this.getCategoriesForChart(income);
        const expenseCategories = this.getCategoriesForChart(expense);

        if (this.incomeChart) {
            this.incomeChart.destroy();
        }
        this.incomeChart = this.initChart(incomeCategories, this.ctx1);

        if (this.expenseChart) {
            this.expenseChart.destroy();
        }
        this.expenseChart = this.initChart(expenseCategories, this.ctx2);

    }

    getCategoriesForChart(categories) {
        if (categories)
            return categories.reduce((acc, curr) => {
                const category = curr.category ? curr.category : "Без категории";

                const amount = parseFloat(curr.amount);

                acc[category] = (acc[category] || 0) + amount;
                return acc;
            }, {});
        else return [];
    }

    initChart(chartData, ctx) {
        const labels = Object.keys(chartData);
        const amounts = Object.values(chartData);
const CHART_COLORS = config.chartColors;
       const data = {
            labels: labels,
            datasets: [{
              //  label: 'Dataset 1',
                data: amounts,
                radius: '80%',
                backgroundColor: CHART_COLORS.slice(0, labels.length),
            }]
        };

        const configChart = {
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
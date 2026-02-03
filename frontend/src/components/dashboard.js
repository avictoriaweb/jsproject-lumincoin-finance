import * as bootstrap from "bootstrap";
import Chart from 'chart.js/auto';

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.initDatePickers();
        this.initCharts();
    }

    initDatePickers() {
        document.querySelectorAll('.date-link').forEach(link => {
            link.removeEventListener('click', this.handleDateClick);
            link.addEventListener('click', this.handleDateClick);
        });
    }

    handleDateClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('data-target');
        const dateInput = document.getElementById(targetId);

        if (dateInput) {
            dateInput.showPicker();
        } else {
            console.error('Date input not found:', targetId);
        }
    }

    initCharts() {

        // 1. Данные
        const data = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                label: 'Dataset 1',
                data: [10, 20, 30, 40, 50],
                radius: '80%',
                backgroundColor: [
                    '#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD' // Цвета CHART_COLORS
                ],
            }]
        };

// 2. Конфигурация
        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                }
            },
        };

        const ctx1 = document.getElementById('incomeChart');
        new Chart(ctx1, config);

        const ctx2 = document.getElementById('expenseChart');
        new Chart(ctx2, config);
    }
}
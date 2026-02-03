import {Transactions} from "./components/transactions.js";
import {CreateTransaction} from "./components/create-transaction";
import {EditTransaction} from "./components/edit-transaction";
import {IncomeList} from "./components/income-list";
import {CreateIncome} from "./components/create-income";
import {EditIncome} from "./components/edit-income";
import {ExpenseList} from "./components/expense-list";
import {CreateExpense} from "./components/create-expense";
import {EditExpense} from "./components/edit-expense";
import {Dashboard} from "./components/dashboard";


export class Router {
    constructor() {
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                   // new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                   // new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/transactions',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/transactions/transactions.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                     new Transactions(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/create-transaction',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/transactions/create-transaction.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new CreateTransaction(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/edit-transaction',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/transactions/edit-transaction.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new EditTransaction(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/income-list',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/income-list.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/create-income',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/incomes/create-income.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new CreateIncome(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/edit-income',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/pages/incomes/edit-income.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new EditIncome(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/expense-list',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/expense-list.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/create-expense',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/expenses/create-expense.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new CreateExpense(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },
            {
                route: '/edit-expense',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/pages/expenses/edit-expense.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new EditExpense(this.openNewRoute.bind(this));
                },
                scripts: [],
                styles: []
            },


        ];
    }
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
       // document.addEventListener('click', this.clickHandler.bind(this));
    }
    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async activateRoute(e, oldRoute = null) {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if(newRoute.useLayout){
                this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                this.sidebarPageElement = document.getElementById('page-content');
                this.sidebarPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());

            }
            else{
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }

    }
}
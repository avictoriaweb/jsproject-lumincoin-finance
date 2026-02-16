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
import {Login} from "./components/auth/login";
import {Logout} from "./components/auth/logout";
import {AuthUtils} from "./utils/auth-utils";
import {SignUp} from "./components/auth/sign-up";


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
                needAuth: true,
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
                    new Login(this.openNewRoute.bind(this));
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
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/transactions',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/transactions/transactions.html',
                useLayout: '/templates/sidebar.html',
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
                needAuth: true,
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
            //проверка авторизован ли пользователь
            if(newRoute.needAuth){
                const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);
                // 1. Если вообще нет токенов - на логин
                if (!accessToken && !refreshToken) {
                    return this.redirectToLogin();
                }

                // 2. Если accessToken пропал, но есть refreshToken - пытаемся обновиться
                if (!accessToken && refreshToken) {
                    const result = await AuthUtils.updateRefreshToken();
                    if (!result) {
                        return this.redirectToLogin();
                    }
                }

            }

            if (newRoute.useLayout) {
                this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                this.sidebarPageElement = document.getElementById('page-content');
                this.sidebarPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());

                this.profileNameElement = document.getElementById('profile-name');
                if (!this.userName) {

                    let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if (userInfo) {
                        userInfo = JSON.parse(userInfo);
                        if (userInfo.name && userInfo.lastName) {
                            this.userName = userInfo.name + ' ' + userInfo.lastName;
                        }
                    }

                }
                this.profileNameElement.innerText = this.userName;
                this.activateMenuItem(newRoute.route);
                if(newRoute.route === "/create-expense" || newRoute.route === "/edit-expense"){
                    this.activateMenuItem("/expense-list");
                } else if(newRoute.route === "/create-income" || newRoute.route === "/edit-income"){
                    this.activateMenuItem("/income-list");
                } else if(newRoute.route === "/create-transaction" || newRoute.route === "/edit-transaction"){
                    this.activateMenuItem("/transactions");
                }

            } else {
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

    activateMenuItem(route) {
        //для пунктов меню верхнего уровня
        const menuItems = document.querySelectorAll('.sidebar .nav-link');
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if ((route.includes(href) && href !== '/') || (route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        //для страниц из выпадающего списка
        const subMenuItems = document.querySelectorAll('.sidebar .collapse .nav-link');
        for (const item of subMenuItems) {
            const href = item.getAttribute('href');
            const collapseElement = document.getElementById("dashboard-collapse");
            if (route.includes(href)) {
                item.classList.add('active');
                if (collapseElement) {
                    const toggleBtn = document.querySelector(`[data-bs-target="#${collapseElement.id}"]`);
                    if (toggleBtn) {
                        toggleBtn.setAttribute('aria-expanded', 'true');
                        toggleBtn.classList.remove('collapsed');
                        toggleBtn.classList.add('dropdown-active');
                   }
                    collapseElement.classList.add('show');
                    break;
                }
            } else {
                  item.classList.remove('active');
                      if (collapseElement) {
                          const toggleBtn = document.querySelector(`[data-bs-target="#${collapseElement.id}"]`);
                          if (toggleBtn) {
                              toggleBtn.setAttribute('aria-expanded', 'false');
                              toggleBtn.classList.add('collapsed');
                              toggleBtn.classList.remove('dropdown-active');
                         }
                          collapseElement.classList.remove('show');}
            }
        }

    }

    async redirectToLogin() {
        history.pushState({}, '', '/login');
        await this.activateRoute();
    }
}
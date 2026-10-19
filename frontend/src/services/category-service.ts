import {HttpUtils} from "../utils/http-utils";
import type {CategoriesResult, Category, CategoryResult} from "../types/categories.type";
import type {HttpResponseType} from "../types/http-response.type";
import type {Transaction} from "../types/transactions.type.js";

export class CategoryService {
    public static async getCategoryList(type: string = 'income'): Promise<CategoriesResult> {
        const returnObject: CategoriesResult = {
            error: false,
            redirect: null,
            categories: null
        };
        const result: HttpResponseType = await HttpUtils.request('/categories/' + type);

        if (result.redirect || result.error || !result.response) {
            returnObject.error = 'Возникла ошибка при запросе заказов. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response as Category[];

        return returnObject;
    }

    public static async getCategory(type:string, id:string):Promise<CategoryResult> {
        const returnObject:CategoryResult = {
            error: false,
            redirect: null,
            category: null
        };
        const result:HttpResponseType = await HttpUtils.request('/categories/' + type + '/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе заказа. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response as Category;

        return returnObject;
    }

    public static async createCategory(type:string, data:string):Promise<CategoryResult> {
        const returnObject : CategoryResult= {
            error: false,
            redirect: null,
            id: null
        };
        const result:HttpResponseType = await HttpUtils.request('/categories/' + type, 'POST', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении категории. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }
        let categoryId: number | undefined = (result.response as Category).id;
        if (categoryId) {
            returnObject.id = categoryId;
        }

        return returnObject;
    }

   public static async deleteCategory(type:string, id:string):Promise<CategoryResult> {
        const returnObject:CategoryResult = {
            error: false,
            redirect: null,
        };
        const result:HttpResponseType = await HttpUtils.request('/categories/' + type + '/' + id, 'DELETE', true);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении заказа. Обратитесь в поддержку';
            if (result.redirect  && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    public static async updateCategory(type:string, id:string, data:string):Promise<CategoryResult> {
        const returnObject:CategoryResult = {
            error: false,
            redirect: null,
        };
        const result:HttpResponseType = await HttpUtils.request('/categories/' + type + '/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании заказа. Обратитесь в поддержку';
            if (result.redirect && typeof result.redirect === 'string') {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}
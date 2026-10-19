export type CategoriesResult = {
    error: string | boolean;
    redirect: string | null;
    categories: Category[] | null;
}
export type CategoryResult = {
    error: string | boolean;
    redirect: string | null;
    category?: Category | null;
    id?: number | null;
}
export type Category = {
    id?: number;
    title: string;

}

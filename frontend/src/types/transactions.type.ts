export type TransactionsResult = {
    error: string | boolean;
    redirect: string | null;
    transactions?: Transaction[] | null;
}
export type TransactionResult = {
    error: string | boolean;
    redirect: string | null;
    transaction?: Transaction | null;
    id?: number | null;
}
export type Transaction = {
    id?: number;
    category_id: number;
    type: string;
    amount: string | number;
    category?: string;
    date: string;
    comment?: string;
}

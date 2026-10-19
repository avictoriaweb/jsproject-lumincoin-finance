import type {CustomResponseData} from "./http-response.type";

export type BalanceType={
    error: string | boolean,
    redirect: string | null,
    balance: CustomResponseData | null
}
export type BalanceResponseType={
    balance?:string| null
}
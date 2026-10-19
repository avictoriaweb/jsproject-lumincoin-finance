export type HttpResponseType = {
    error: boolean,
    response: CustomResponseData | null,
    redirect?: boolean | string | null,
}
export type CustomResponseData = {
    error?: boolean;
    balance?:string|null;
    tokens?:TokensType;
    user?:UserType;
};
export type TokensType = {
    accessToken: string;
    refreshToken: string;
}
export type UserType = {
    id: number | string;
    name: string;
    lastName: string;
    email?:string;
}

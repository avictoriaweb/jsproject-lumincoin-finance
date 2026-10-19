export type HttpRequestType={
    method: string,
    headers: Record<string, string>,
    body?:string
}
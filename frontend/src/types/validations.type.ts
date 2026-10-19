export type ValidationsType = {
    element: HTMLInputElement | null;
    options?: ValidationOptions
}
export type ValidationOptions={
    pattern?: RegExp,
    compareTo?: string,
    checkProperty?:string,
    checked?:boolean
}
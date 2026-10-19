
export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string | boolean,
    needAuth?: boolean,
    load?: () => void,
    unload?: () => void,
    scripts?: string[],
    styles?: string[]
}
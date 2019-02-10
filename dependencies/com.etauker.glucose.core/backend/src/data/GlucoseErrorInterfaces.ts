export interface IGlucoseError {
    package: string;
    module: string;
    class: string;
    code: string;
    message: string;
    http: number;
    error: object;
}
export interface IGlucoseHttpError {
    code: string;
    message: string;
    status: number;
}

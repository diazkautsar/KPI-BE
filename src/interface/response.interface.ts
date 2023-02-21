export interface ResponseInterface {
    statusCode: number;
    success: boolean;
    message: string | null;
    messageTitle: string | null;
    summary: object | null;
    data: object[] | object | null;
    responseTime?: string;
    error: string | null | undefined;
}

export interface GREInterface {
    success: boolean;
    message: string;
    messageTitle: string | null;
    data: object[] | object | null;
    summary: object | null;
    statusCode: number;
    startTime: number;
    error?: string | null;
    toResponse(): ResponseInterface;
}

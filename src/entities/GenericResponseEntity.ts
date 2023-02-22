import httpStatus from 'http-status';
import { GREInterface, ResponseInterface } from '../interface/response.interface';

class GenericResponseEntity implements GREInterface {
    private _success: boolean;
    private _message: string;
    private _messageTitle: string | null;
    private _data: object | null;
    private _summary: object | null;
    private _statusCode: number;
    private _startTime: number;
    private _error: string | null;

    get success(): boolean {
        return this._success;
    }

    set success(value: boolean) {
        this._success = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get messageTitle(): string | null {
        return this._messageTitle;
    }

    set messageTitle(value: string | null) {
        this._messageTitle = value;
    }

    get data(): object | null | object[] {
        return this._data;
    }

    set data(value: object | null | object[]) {
        this._data = value;
    }

    get summary(): object | null {
        return this._summary;
    }

    set summary(value: object | null) {
        this._summary = value;
    }

    get statusCode(): number {
        return this._statusCode;
    }

    set statusCode(value: number) {
        this._statusCode = value;
    }

    get startTime(): number {
        return this._startTime;
    }

    set startTime(value: number) {
        this._startTime = value;
    }

    get error(): string | null {
        return this._error;
    }

    set error(value: string | null) {
        this._error = value;
    }

    constructor() {
        this._success = false;
        this._message = httpStatus['400_NAME'];
        this._messageTitle = null;
        this._data = null;
        this._summary = null;
        this._statusCode = httpStatus.BAD_REQUEST;
        this._startTime = new Date().getTime();
        this._error = null;
    }

    toResponse(): ResponseInterface {
        const response: ResponseInterface = {
            statusCode: this._statusCode,
            success: this._success,
            message: this._message,
            messageTitle: this._messageTitle,
            summary: this._summary,
            data: this._data,
            responseTime: this._startTime ? new Date().getTime() - this._startTime + ' ms.' : 'unknown',
            error: this._error,
        };

        if (!this._error) {
            delete response.error;
        }

        return response;
    }
}

export default GenericResponseEntity;

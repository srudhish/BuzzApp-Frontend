import { buildUrl } from '../../config/api';

export class ApiError<T = unknown> extends Error {
    status: number;
    data?: T;

    constructor(message: string, status: number, data?: T) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

type RequestOptions = Omit<RequestInit, 'headers' | 'body'> & {
    headers?: Record<string, string>;
    authToken?: string;
    body?: unknown;
};

const parseBody = (text: string): unknown => {
    if (!text) {
        return undefined;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};

const prepareBody = (body: unknown, headers: Record<string, string>) => {
    if (body == null) {
        return undefined;
    }

    if (body instanceof FormData) {
        return body;
    }

    if (typeof body === 'string') {
        return body;
    }

    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    return JSON.stringify(body);
};

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const { authToken, headers: customHeaders = {}, body, method = 'GET', ...rest } = options;

    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...customHeaders,
    };

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const requestBody = prepareBody(body, headers);

    const response = await fetch(buildUrl(path), {
        method,
        headers,
        body: requestBody as BodyInit | undefined,
        ...rest,
    });

    const rawBody = await response.text();
    const parsedBody = parseBody(rawBody);

    if (!response.ok) {
        const message =
            typeof parsedBody === 'string'
                ? parsedBody
                : (parsedBody as { message?: string })?.message || `Request failed with status ${response.status}`;

        throw new ApiError(message, response.status, parsedBody);
    }

    return parsedBody as T;
};

export const get = async <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' });

export const post = async <TRequest, TResponse>(path: string, body?: TRequest, options?: RequestOptions) =>
    request<TResponse>(path, { ...options, method: 'POST', body });

export const put = async <TRequest, TResponse>(path: string, body?: TRequest, options?: RequestOptions) =>
    request<TResponse>(path, { ...options, method: 'PUT', body });

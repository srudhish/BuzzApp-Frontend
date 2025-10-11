export type ApiConfig = {
    /** Base URL for all API requests. */
    baseUrl: string;
};
export const API_BASE_URL = 'http://192.168.1.33:5210/api';

const DEFAULT_CONFIG: ApiConfig = {
    baseUrl: API_BASE_URL,
};

const runtimeConfig: Partial<ApiConfig> =
    (typeof globalThis !== 'undefined' && (globalThis as { __APP_CONFIG__?: Partial<ApiConfig> }).__APP_CONFIG__) || {};

export const apiConfig: ApiConfig = {
    ...DEFAULT_CONFIG,
    ...runtimeConfig,
};

export const buildUrl = (path: string) => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${apiConfig.baseUrl.replace(/\/$/, '')}/${normalizedPath}`;
};

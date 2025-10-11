export type ApiConfig = {
    /** Base URL for all API requests. */
    baseUrl: string;
};

const DEFAULT_CONFIG: ApiConfig = {
    baseUrl: 'http://10.0.2.2:5210/api',
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

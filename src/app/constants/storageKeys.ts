export const STORAGE_KEYS = {
    token: '@auth/token',
    role: '@auth/role',
    userId: '@auth/userId',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

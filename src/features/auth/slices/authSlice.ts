import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { post } from '../../api/apiClient';
import { User, AuthTokens, AuthState } from '../types';
import { refreshTokens } from '../services/authService';

// =====================
// 🔹 Helpers
// =====================
const persistAuthData = async (tokens: AuthTokens, user: User) => {
    await AsyncStorage.setItem('auth', JSON.stringify({ tokens, user }));
};

const clearAuthData = async () => {
    await AsyncStorage.removeItem('auth');
};

// =====================
// 🔹 Async Thunks
// =====================

// 🔐 Login (by OTP verification or direct credentials)
export const loginUser = createAsyncThunk<
    { user: User; tokens: AuthTokens },
    { mobileNumber: string; otpCode: string },
    { rejectValue: string }
>('auth/loginUser', async (payload, thunkAPI) => {
    try {
        const res = await post('/auth/verify-otp', payload);
        const { user, accessToken, refreshToken } = res;
        const tokens = { accessToken, refreshToken };
        await persistAuthData(tokens, user);
        return { user, tokens };
    } catch (error: any) {
        const msg = error?.message || 'Login failed. Please try again.';
        return thunkAPI.rejectWithValue(msg);
    }
});

// 🚪 Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    await clearAuthData();
    return null;
});

// 💾 Load persisted user
export const loadUserFromStorage = createAsyncThunk<
    { user: User; tokens: AuthTokens } | null
>('auth/loadUserFromStorage', async () => {
    const stored = await AsyncStorage.getItem('auth');
    if (!stored) return null;
    return JSON.parse(stored);
});

// ♻️ Refresh Token
export const refreshAuthTokens = createAsyncThunk<
    AuthTokens,
    void,
    { rejectValue: string }
>('auth/refreshAuthTokens', async (_, thunkAPI) => {
    try {
        const stored = await AsyncStorage.getItem('auth');
        if (!stored) throw new Error('No session found');
        const parsed = JSON.parse(stored);
        const newTokens = await refreshTokens(parsed.tokens.refreshToken);
        const updated = { ...parsed, tokens: newTokens };
        await AsyncStorage.setItem('auth', JSON.stringify(updated));
        return newTokens;
    } catch (err: any) {
        return thunkAPI.rejectWithValue('Session expired. Please login again.');
    }
});

// =====================
// 🔹 Slice Definition
// =====================
const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.tokens.accessToken;
                state.refreshToken = action.payload.tokens.refreshToken || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
            })

            // Logout
            .addCase(logoutUser.fulfilled, () => initialState)

            // Load persisted user
            .addCase(loadUserFromStorage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.accessToken = action.payload.tokens.accessToken;
                    state.refreshToken = action.payload.tokens.refreshToken || null;
                }
            })

            // Refresh tokens
            .addCase(refreshAuthTokens.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(refreshAuthTokens.rejected, (state) => {
                // Session expired → clear auth
                Object.assign(state, initialState);
            });
    },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;

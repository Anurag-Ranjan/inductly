import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
	id: number;
	name: string;
	email: string;

	profile_picture: string | null;

	isVerified: boolean;
	isProfileComplete: boolean;
	isPictureUploaded: boolean;
	isOnboarded: boolean;
}

interface AuthState {
	user: AuthUser | null;

	isAuthenticated: boolean;

	loading: boolean;

	error: string | null;
}

const initialState: AuthState = {
	user: null,

	isAuthenticated: false,

	loading: false,

	error: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<AuthUser>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},

		clearUser: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
		},

		setLoading: (state, action) => {
			state.loading = action.payload;
		},

		setError: (state, action) => {
			state.error = action.payload;
			setLoading(false);
		},
	},
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

export const authReducer = authSlice.reducer;

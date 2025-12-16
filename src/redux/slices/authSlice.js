import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_CRYPTO_KEY || "fallback_key"
      ).toString();

      const res = await axios.post(
        `${baseUrl}/api/auth/admin/login`,
        { email, password: encryptedPassword },
        { withCredentials: true }
      );

      // Cookie is set, just return the user
      return res.data.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// ---------------- VERIFY AUTH ----------------
export const verifyAuth = createAsyncThunk(
  "auth/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

      const res = await axios.get(`${baseUrl}/api/auth/admin/verify`, {
        withCredentials: true,
      });

      return res.data.admin;
    } catch (err) {
      return rejectWithValue({ message: "Verification failed" });
    }
  }
);

// ---------------- LOGOUT ----------------
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

      await axios.post(`${baseUrl}/api/auth/admin/logout`, {}, { withCredentials: true });

      return true;
    } catch (err) {
      return rejectWithValue({ message: "Logout failed" });
    }
  }
);

// ---------------- SLICE ----------------

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.isAuthenticated = false;
      })

      // VERIFY
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        logoutUser();
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { setLoading } = authSlice.actions;

export default authSlice.reducer;

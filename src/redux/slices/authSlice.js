import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import { fetchData } from "../api";
import { setCookie, removeCookie, getCookie } from "../../utils/cookieUtils";
import axios from "axios";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_CRYPTO_KEY || "fallback_key"
      ).toString();
      // The browser sends an OPTIONS request before POST due to CORS preflight.
      // This is normal when making cross-origin requests with custom headers.
      // No code needed here; just an explanation.
      const response = await axios.post(
        `${baseUrl}/api/auth/admin/login`,
        {
          email,
          password: encryptedPassword,
        },
        
      );

      const data = await response.data;

      console.log("Login response data:", data);

      // if (!response.success) {
      //   throw new Error(data.message || "Login failed");
      // }

      // // Verify admin role
      // if (!data.data.admin || data.data.admin.role !== "admin") {
      //   throw new Error("Unauthorized access");
      // }

      // Save user data and token to cookies with longer expiration
      setCookie("adminToken", data.token, 30);
      setCookie("adminUser", data.data.admin, 30);

      // Return the admin data with token
      return { ...data.data.admin, token: data.token };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Clear local storage, cookies, etc.
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      // Clear cookies if needed
      document.cookie =
        "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "adminUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/users/me");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to get current user" }
      );
    }
  }
);

// Synchronous function to verify login status from cookies
export const verifyLoginFromCookies = () => (dispatch) => {
  try {
    const token = getCookie("adminToken");
    const userData = getCookie("adminUser", true);

    console.log("Checking cookies for authentication:", {
      hasToken: !!token,
      hasUserData: !!userData,
      userRole: userData?.role,
    });

    if (token && userData && userData.role === "admin") {
      dispatch(setUser(userData));
      return true;
    } else {
      dispatch(clearUser());
      return false;
    }
  } catch (error) {
    console.error("Error verifying login from cookies:", error);
    dispatch(clearUser());
    return false;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // Store in localStorage
        localStorage.setItem("adminToken", action.payload.token);
        localStorage.setItem("adminUser", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
      });
  },
});

export const { resetAuthStatus, setUser, clearUser, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;

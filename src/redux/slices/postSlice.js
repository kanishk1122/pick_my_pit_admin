import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Async Thunk: Fetch Posts with Backend Filtering ---
export const fetchApprovalPosts = createAsyncThunk(
  "posts/fetchApprovalPosts",
  // 1. Accept 'filters' argument (default to empty object)
  async (filters = {}, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

      // 2. Build Query Parameters Object
      const params = {};
      
      // Only add parameters if they are present and not "all"
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }
      if (filters.species && filters.species !== "all") {
        params.species = filters.species;
      }

      // 3. Send Request with Params
      // Axios will automatically convert params to ?search=...&status=...
      const response = await axios.get(`${baseUrl}/api/posts/pending-approvals`, {
        params: params, 
        withCredentials: true,
      });

      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch posts" }
      );
    }
  }
);

// --- Async Thunk: Approve Listing ---
export const approveListing = createAsyncThunk(
  "posts/approveListing",
  async (postId, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
      const response = await axios.put(`${baseUrl}/api/post/${postId}/approve`);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to approve listing" }
      );
    }
  }
);

// --- Async Thunk: Reject Listing ---
export const rejectListing = createAsyncThunk(
  "posts/rejectListing",
  async (postId, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
      const response = await axios.put(`${baseUrl}/api/post/${postId}/reject`);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reject listing" }
      );
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    approvalPosts: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch Posts Cases ---
      .addCase(fetchApprovalPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalPosts.fulfilled, (state, action) => {
        state.loading = false;
        // The payload is now the filtered list directly from the backend
        state.approvalPosts = action.payload; 
      })
      .addCase(fetchApprovalPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch posts";
      })

      // --- Approve Cases ---
      .addCase(approveListing.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(approveListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Optimistic UI Update: Update status locally so we don't need to refetch
        state.approvalPosts = state.approvalPosts.map((post) =>
          post.id === action.payload.postId
            ? { ...post, status: "approved" }
            : post
        );
      })
      .addCase(approveListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload?.message || "Failed to approve listing";
      })

      // --- Reject Cases ---
      .addCase(rejectListing.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(rejectListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Optimistic UI Update
        state.approvalPosts = state.approvalPosts.map((post) =>
          post.id === action.payload.postId
            ? { ...post, status: "rejected" }
            : post
        );
      })
      .addCase(rejectListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError =
          action.payload?.message || "Failed to reject listing";
      });
  },
});

export default postSlice.reducer;
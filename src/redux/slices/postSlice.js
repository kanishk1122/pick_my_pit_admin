import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch approval posts
export const fetchApprovalPosts = createAsyncThunk(
  "posts/fetchApprovalPosts",
  async (_, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;
      const response = await axios.get(`${baseUrl}/api/posts/pending-approvals`,{
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

// Async thunk to approve a listing
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

// Async thunk to reject a listing
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
      .addCase(fetchApprovalPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalPosts = action.payload;
      })
      .addCase(fetchApprovalPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch posts";
      })
      .addCase(approveListing.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(approveListing.fulfilled, (state, action) => {
        state.actionLoading = false;
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
      .addCase(rejectListing.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(rejectListing.fulfilled, (state, action) => {
        state.actionLoading = false;
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

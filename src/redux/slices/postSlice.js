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
      const response = await axios.get(`${baseUrl}/api/post/approvals`);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch posts" }
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
      });
  },
});

export default postSlice.reducer;

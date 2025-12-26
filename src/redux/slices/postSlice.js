import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Global Config ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

// --- Async Thunk: Fetch All Posts ---
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (
    { page = 1, limit = 10, status = "all" } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit };
      if (status && status !== "all") {
        params.status = status;
      }

      const response = await axios.get(`${BASE_URL}/api/posts/getpost-admin`, {
        params,
        withCredentials: true,
      });
      // Ensure payload has data and pagination structure
      return response.data || { data: [], pagination: {} }; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch posts" }
      );
    }
  }
);

// --- Async Thunk: Ban Post ---
export const banPost = createAsyncThunk(
  "posts/banPost",
  async ({ postId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/posts/${postId}/reject`,
        { reason },
        { withCredentials: true }
      );
      // Return post data from response
      return { postId, ...response.data.data }; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to ban post" }
      );
    }
  }
);

// --- Async Thunk: Fetch Single Post for Admin ---
export const fetchPostByIdForAdmin = createAsyncThunk(
  "posts/fetchPostByIdForAdmin",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/posts/admin/${postId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch post details" }
      );
    }
  }
);

// --- Async Thunk: Fetch Posts with Backend Filtering ---
export const fetchApprovalPosts = createAsyncThunk(
  "posts/fetchApprovalPosts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // 1. Build Query Parameters Object
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

      // 2. Send Request with Params
      const response = await axios.get(
        `${BASE_URL}/api/posts/pending-approvals`,
        {
          params: params,
          withCredentials: true,
        }
      );

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
      const response = await axios.put(
        `${BASE_URL}/api/posts/${postId}/approve`,
        {},
        {
          withCredentials: true,
        }
      );
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
  async ({ postId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/posts/${postId}/reject`,
        { reason },
        { withCredentials: true }
      );
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
    allPosts: {
      data: [],
      pagination: {},
    }, // To store all posts for PetsList
    approvalPosts: [],
    selectedPost: {
      data: null,
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  },
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost.data = null;
      state.selectedPost.loading = false;
      state.selectedPost.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch All Posts Cases ---
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.allPosts.data = []; // Clear previous data
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        console.log("Fetched Posts Payload:", action.payload);
        state.loading = false;
        state.allPosts.data = action.payload.data;
        state.allPosts.pagination = action.payload.meta.pagination;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        console.error("Fetch All Posts Error:", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch posts";
      })

      // --- Fetch Single Post for Admin Cases ---
      .addCase(fetchPostByIdForAdmin.pending, (state) => {
        state.selectedPost.loading = true;
        state.selectedPost.error = null;
        state.selectedPost.data = null;
      })
      .addCase(fetchPostByIdForAdmin.fulfilled, (state, action) => {
        state.selectedPost.loading = false;
        state.selectedPost.data = action.payload;
      })
      .addCase(fetchPostByIdForAdmin.rejected, (state, action) => {
        state.selectedPost.loading = false;
        state.selectedPost.error =
          action.payload?.message || "Failed to fetch post details";
      })

      // --- Ban Post Cases ---
      .addCase(banPost.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(banPost.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedPost = action.payload;
        
        // Update the post in allPosts if it exists
        if(state.allPosts.data) {
            state.allPosts.data = state.allPosts.data.map((post) =>
            post._id === updatedPost.postId ? { ...post, ...updatedPost } : post
            );
        }
        
        // Update the post in approvalPosts if it exists
        if(state.approvalPosts.length > 0) {
            state.approvalPosts = state.approvalPosts.map((post) =>
            post._id === updatedPost.postId ? { ...post, ...updatedPost } : post
            );
        }
      })
      .addCase(banPost.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || "Failed to ban post";
      })

      // --- Fetch Approval Posts Cases ---
      .addCase(fetchApprovalPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.approvalPosts = []; // Clear approval posts, not allPosts
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
        // Optimistic UI Update using _id
        state.approvalPosts = state.approvalPosts.map((post) =>
          post._id === action.payload.postId
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
        // Optimistic UI Update using _id
        state.approvalPosts = state.approvalPosts.map((post) =>
          post._id === action.payload.postId
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

export const { clearSelectedPost } = postSlice.actions;

export default postSlice.reducer;
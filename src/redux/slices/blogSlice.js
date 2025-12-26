import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

// --- THUNK: Fetch All Blog Posts ---
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (
    { page = 1, limit = 10, status = "all" } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/blogs/admin/all`, {
        params: { page, limit, status },
        withCredentials: true,
      });
      return response.data; // { data: [], meta: { pagination: {} } }
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- THUNK: Create Blog Post ---
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/blogs/admin`,
        blogData,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- THUNK: Update Blog Post ---
export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, ...blogData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/blogs/admin/${id}`,
        blogData,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- THUNK: Delete Blog Post ---
export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/blogs/admin/${id}`, {
        withCredentials: true,
      });
      return id; // Return the ID for removal from state
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    posts: [],
    pagination: {},
    loading: false,
    error: null,
    currentPost: null,
  },
  reducers: {
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = action.payload.meta.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch blogs";
      })
      // Create Blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Add to the beginning of the list
      })
      // Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setCurrentPost, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;

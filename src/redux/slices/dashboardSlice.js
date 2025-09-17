import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../api";

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/dashboard/stats");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch dashboard stats" }
      );
    }
  }
);

// Async thunk for fetching recent activities
export const fetchRecentActivities = createAsyncThunk(
  "dashboard/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/api/dashboard/activities");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch activities" }
      );
    }
  }
);

const initialState = {
  stats: {
    totalPets: 0,
    availablePets: 0,
    totalUsers: 0,
    pendingAdoptions: 0,
    totalSpecies: 0,
    activeSpecies: 0,
    totalDonations: 0,
    monthlyRevenue: 0,
  },
  activities: [],
  status: "idle",
  error: null,
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboardStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch stats";
        state.status = "failed";
      })
      .addCase(fetchRecentActivities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.activities = action.payload.data || action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch activities";
        state.status = "failed";
      });
  },
});

export const { resetDashboardStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;

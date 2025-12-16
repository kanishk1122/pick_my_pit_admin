"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web

import authReducer from "./slices/authSlice";
import speciesReducer from "./slices/speciesSlice";
import dashboardReducer from "./slices/dashboardSlice";
import postReducer from "./slices/postSlice";

// 1. Create a root reducer that combines all your slices
const rootReducer = combineReducers({
  auth: authReducer,
  species: speciesReducer,
  dashboard: dashboardReducer,
  posts: postReducer,
});

// 2. Configure Persist Settings
const persistConfig = {
  key: "root",
  storage,
  // Whitelist: Only these slices will be saved to localStorage.
  // We include 'posts' (to fix your reload issue) and 'auth' (to keep users logged in).
  whitelist: ["auth", "posts"], 
};

// 3. Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // These checks must be ignored for redux-persist to work correctly
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Export the persistor (used in your Provider)
export const persistor = persistStore(store);
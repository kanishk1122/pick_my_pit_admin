"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import speciesReducer from "./slices/speciesSlice";

// Create a function to create the store so we can properly handle SSR
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      species: speciesReducer,
    },
    // Add middleware to handle serialization issues with SSR
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

// Create the store
export const store = makeStore();


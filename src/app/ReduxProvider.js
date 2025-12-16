"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store"; // Import both store and persistor

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {/* loading={null} passes nothing while rehydrating. 
        You can pass a loading spinner component here if you want.
      */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
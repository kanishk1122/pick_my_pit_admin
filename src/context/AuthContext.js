"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuth, logoutUser } from "../redux/slices/authSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Call backend verify route → loads user if valid cookie present
      try {
        await dispatch(verifyAuth());
      } catch (err) {
        console.error("Auth verification failed:", err);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [dispatch]);



  // if (!initialized) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
  //       <div className="text-white text-xl mb-4">
  //         Checking authentication...
  //       </div>
  //       <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

    const logout = async () => {
    await dispatch(logoutUser());
    // Do NOT redirect here — middleware will automatically redirect on next route load
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

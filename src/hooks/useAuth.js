import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuth } from "../redux/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(verifyAuth());
    }
  }, [dispatch, isAuthenticated, loading]);

  return { isAuthenticated, loading, user };
};

export default useAuth;

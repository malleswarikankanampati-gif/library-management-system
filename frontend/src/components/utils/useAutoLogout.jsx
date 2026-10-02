import { useEffect } from "react";
import {
  allLogout,
  getMemberDetailsLocal,
} from "../../app/features/auth/authSlice";
import { getJwtTokenExpiration } from "../../service/auth";
import { useNavigate } from "react-router-dom";

export const useAutoLogout = (
  isAuthenticated,
  dispatch,
  setDisplayLogoutPopup,
) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer = null;

    if (isAuthenticated) {
      const expirationTime = getJwtTokenExpiration();
      const remainingTime = expirationTime - Date.now();

      if (remainingTime > 0) {
        timer = setTimeout(() => {
          setDisplayLogoutPopup(true);
        }, remainingTime);
      } else {
        dispatch(allLogout());
        navigate("/");
      }

      dispatch(getMemberDetailsLocal());
    }

    return () => {
      if (timer) clearTimeout(timer);
      setDisplayLogoutPopup(false);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "authstatus" || event.key === null) {
        const authStatus = localStorage.getItem("authstatus");

        if (!authStatus) {
          dispatch(allLogout());
          navigate("/");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
};

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { allLogout, setCurrentUrl } from "../../app/features/auth/authSlice";

const AutoLogoutPopup = ({ setDisplayLogoutPopup, dispatch }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-gradient-to-br from-orange-50 via-white to-orange-100 p-10 rounded-3xl w-full max-w-lg text-center shadow-2xl border border-orange-300 transform transition-all duration-500 ease-out ${
          show ? "scale-105 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 17c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-4 text-orange-800 uppercase tracking-wide">
          Session Expired
        </h2>

        {/* Message */}
        <p className="text-orange-700 mb-10 text-lg leading-relaxed max-w-md mx-auto">
          Your login session has ended for security purposes.
          <span className="block mt-1 font-medium text-orange-600">
            Please sign in again to continue.
          </span>
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5">
          <button
            onClick={() => {
              dispatch(setCurrentUrl(location.pathname));
              dispatch(allLogout());
              setDisplayLogoutPopup(false);
              setTimeout(() => navigate("/login"), 0);
            }}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            Log In
          </button>

          <button
            onClick={() => {
              dispatch(allLogout());
              setDisplayLogoutPopup(false);
              navigate("/");
            }}
            className="flex-1 bg-white border border-orange-400 text-orange-700 py-3 px-6 rounded-xl text-lg font-semibold hover:bg-orange-50 transition-all duration-300 cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutPopup;

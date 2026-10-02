import React, { useState } from "react";
import bgImage from "../../assets/img/bg1.jpg";
import { useNavigate } from "react-router-dom";
import { loginUser, loginUserViaOauth } from "../../service/auth";
import { useDispatch, useSelector } from "react-redux";
import { SERVE_URL } from "../../service/config";

const Login = () => {
  const dispatch = useDispatch();
  const { currentUrl } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please fill in both username and password.");
      return;
    }

    tryLogin({ username, password });
  };

  const tryLogin = async (data) => {
    setLoading(true);
    try {
      await loginUser(data, dispatch, navigate, setErrorMessage, currentUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleOauthLogin = (provider) => {
    // 1. Open the backend OAuth2 URL in a popup
    const popup = window.open(
      `${SERVE_URL}/oauth2/authorization/${provider}`,
      "oauth2_popup",
      "width=600,height=700",
    );

    const handleMessage = (event) => {
      console.log(event.data);

      if (event.origin !== SERVE_URL) return;

      if (event.data.type === "AUTH_SUCCESS") {
        const { token, expiration } = event.data;

        loginUserViaOauth(
          "Bearer ",
          token,
          expiration,
          dispatch,
          navigate,
          setErrorMessage,
          currentUrl,
        );

        window.removeEventListener("message", handleMessage);
        console.log("Login Successful!");
      }
    };

    window.addEventListener("message", handleMessage);
  };

  // Helper to render input fields to keep it DRY and consistent with Register
  const renderInput = (label, type, value, onChange, placeholder) => (
    <div className="space-y-1.5">
      <label className="block text-orange-100 text-xs font-bold uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-orange-700/30 focus:border-orange-500 transition-all duration-300"
        required
      />
    </div>
  );

  return (
    <div className="relative h-full flex items-center justify-center font-['Inter'] p-4">
      {/* Background with optimized overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px]"></div>

      <div className="relative z-10 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-orange-700/20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-orange-400 uppercase tracking-tighter">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {renderInput(
            "Username",
            "text",
            username,
            setUsername,
            "Enter your username",
          )}
          {renderInput(
            "Password",
            "password",
            password,
            setPassword,
            "Enter your password",
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-orange-900/20 transform active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-orange-700/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-4 text-gray-500 backdrop-blur-3xl select-none tracking-widest font-bold">
              Or Continue with
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Google Button */}
          <button
            onClick={() => handleOauthLogin("google")}
            className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] group cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                className="text-[#4285F4]"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                className="text-[#34A853]"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                className="text-[#FBBC05]"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                className="text-[#EA4335]"
              />
            </svg>
            <span className="text-sm font-bold tracking-wide">Google</span>
          </button>

          {/* Microsoft Button */}
          <button
            onClick={() => handleOauthLogin("microsoft")}
            className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] group cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23">
              <rect x="0" y="0" width="10.8" height="10.8" fill="#f25022" />
              <rect x="12.2" y="0" width="10.8" height="10.8" fill="#7fba00" />
              <rect x="0" y="12.2" width="10.8" height="10.8" fill="#00a4ef" />
              <rect
                x="12.2"
                y="12.2"
                width="10.8"
                height="10.8"
                fill="#ffb900"
              />
            </svg>
            <span className="text-sm font-bold tracking-wide">Microsoft</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mt-6 text-red-400 text-xs text-center bg-red-900/20 py-3 px-4 rounded-xl border border-red-800/50">
            {errorMessage}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-orange-700/10 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?
            <button
              onClick={() => navigate("/register")}
              className="text-orange-400 hover:text-orange-300 font-bold ml-2 underline-offset-4 hover:underline transition-all cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/img/bg1.jpg";
import { loginUser, registerNewMember } from "../../service/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    for (const key in formData) {
      if (!formData[key].trim()) {
        setErrorMessage("Please fill in all fields properly.");
        return;
      }
    }

    const trimmedFormData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
    };
    addNewMember(trimmedFormData);
  };

  const addNewMember = async (data) => {
    setLoading(true);
    try {
      await registerNewMember(data);
      await loginUser(
        { username: data.email, password: data.password },
        dispatch,
        navigate,
        setErrorMessage,
      );
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while registering.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to render input fields
  const renderInput = (name, label, type = "text") => (
    <div className="space-y-1.5">
      <label className="block text-orange-100 text-xs font-bold uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={`Enter ${label.toLowerCase()}`}
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

      <div className="relative z-10 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-orange-700/20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-orange-400 uppercase tracking-tighter">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Join us and start your journey
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {/* Left Column */}
          <div className="space-y-5">
            {renderInput("firstName", "First Name")}
            {renderInput("lastName", "Last Name")}
            {renderInput("email", "Email Address", "email")}
          </div>

          {/* Right Column */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              {renderInput("username", "Username")}

              <div className="space-y-1.5 relative">
                <label className="block text-orange-100 text-xs font-bold uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-orange-700/30 focus:border-orange-500 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-500 hover:text-orange-400 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-orange-900/20 transform active:scale-[0.98] transition-all duration-200 mt-4 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-6 text-red-400 text-xs text-center bg-red-900/20 py-3 px-4 rounded-xl border border-red-800/50">
            {errorMessage}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-orange-700/10 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="text-orange-400 hover:text-orange-300 font-bold ml-2 underline-offset-4 hover:underline transition-all cursor-pointer"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

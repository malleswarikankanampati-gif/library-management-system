import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { loginUser, updateMemberSelf, validatePass } from "../../service/auth";
import { useDispatch } from "react-redux";
import { useLockBodyScroll } from "../utils/UtilFuncs";

const MemberEditPopup = ({
  member,
  setIsEditPopupVisible,
  dispatch,
  navigate,
}) => {
  useLockBodyScroll(true);

  const [formData, setFormData] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    username: member.username,
    email: member.email,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [errorTimerId, setErrorTimerId] = useState(null);

  const fieldsToValidate = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "password", label: "Current Password" },
  ];

  useEffect(() => {
    return () => {
      clearTimeout(errorTimerId);
    };
  }, [errorTimerId]);

  const showTempError = (msg) => {
    setErr(msg);
    setErrorTimerId(setTimeout(() => setErr(""), 3000));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Quick helper to normalize values
    const normalize = (val) => val?.trim() ?? "";

    for (const { key, label } of fieldsToValidate) {
      if (!normalize(formData[key])) {
        showTempError(`${label} cannot be blank`);
        return;
      }
    }

    if (
      normalize(formData.firstName) === normalize(member.firstName) &&
      normalize(formData.lastName) === normalize(member.lastName) &&
      normalize(formData.username) === normalize(member.username) &&
      normalize(formData.email) === normalize(member.email)
    ) {
      setIsEditPopupVisible(false);
      return;
    }

    updateSelf(formData);
  };

  const updateSelf = async (formData) => {
    setLoading(true);
    try {
      const res = await validatePass(formData.password);
      if (res.data) {
        const res = await updateMemberSelf(formData);
        console.log("Updated Data:", res.data);
        await loginUser(
          { username: formData.email, password: formData.password },
          dispatch,
          navigate,
          showTempError,
          false
        );
      } else {
        showTempError("Password is incorrect");
        return;
      }
    } catch (error) {
      console.error("Error in login/update flow:", error);
      showTempError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePopupContentClick = (e) => e.stopPropagation();

  return (
    // Backdrop Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm min-h-screen"
      onClick={() => setIsEditPopupVisible(false)}
    >
      {/* Popup Container */}
      <div
        className="flex w-full max-w-4xl animate-slide-down-fade overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={handlePopupContentClick}
      >
        {err && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
              {err}
            </div>
          </div>
        )}
        {loading && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
              Loading...
            </div>
          </div>
        )}

        {/* Left Panel (Visual) */}
        <div className="hidden w-1/3 flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 p-8 text-white md:flex">
          <FiUserCheck size={80} />
          <h2 className="mt-4 text-center text-2xl font-bold">
            Member Profile
          </h2>
          <p className="mt-2 text-center text-sm text-orange-100">
            Keep your information accurate and up-to-date.
          </p>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full md:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Your Details
            </h2>
            <button
              onClick={() => setIsEditPopupVisible(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
              title="Close"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* First Name Input with Floating Label */}
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 text-gray-900 placeholder-transparent transition-colors focus:border-orange-500 focus:outline-none"
                  placeholder="First Name"
                  required
                />
                <label
                  htmlFor="firstName"
                  className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600"
                >
                  First Name
                </label>
              </div>

              {/* Last Name Input with Floating Label */}
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 text-gray-900 placeholder-transparent transition-colors focus:border-orange-500 focus:outline-none"
                  placeholder="Last Name"
                  required
                />
                <label
                  htmlFor="lastName"
                  className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600"
                >
                  Last Name
                </label>
              </div>
            </div>

            {/* Email Input with Floating Label */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 text-gray-900 placeholder-transparent transition-colors focus:border-orange-500 focus:outline-none"
                placeholder="Email Address"
                required
              />
              <label
                htmlFor="email"
                className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600"
              >
                Email Address
              </label>
            </div>

            {/* Username Input with Floating Label */}
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 text-gray-900 placeholder-transparent transition-colors focus:border-orange-500 focus:outline-none"
                placeholder="Username"
                required
              />
              <label
                htmlFor="username"
                className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600"
              >
                Username
              </label>
            </div>

            {/* Pass Input with Floating Label */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 text-gray-900 placeholder-transparent transition-colors focus:border-orange-500 focus:outline-none"
                placeholder="Current Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600"
              >
                Current Password
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditPopupVisible(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-6 py-2.5 font-semibold cursor-pointer text-white shadow-md transition-transform hover:scale-105 hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberEditPopup;

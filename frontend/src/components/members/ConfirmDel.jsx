import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle, FaLock } from "react-icons/fa";
import { validatePass } from "../../service/auth";
import { useLockBodyScroll } from "../utils/UtilFuncs";

const ConfirmDel = ({
  setIsDeleteConfirmPopup1Visible,
  setIsDeleteConfirmPopup2Visible,
}) => {
  useLockBodyScroll(true);

  const [formData, setFormData] = useState({
    password: "",
    confirmText: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const confirmValue = formData.confirmText.trim().toUpperCase();
      if (confirmValue !== "CONFIRM") {
        setErr('You must type "CONFIRM" exactly.');
        return;
      }

      try {
        const res = await validatePass(formData.password);
        if (!res.data) {
          setErr("Password is incorrect");
          return;
        }
      } catch (error) {
        setErr(
          error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred"
        );
      }

      setIsDeleteConfirmPopup1Visible(false);
      setIsDeleteConfirmPopup2Visible(true);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setIsDeleteConfirmPopup1Visible(false)}
    >
      {/* Popup Container */}
      <div
        className="flex w-full max-w-2xl animate-slide-down-fade overflow-hidden rounded-2xl bg-white shadow-2xl flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Error Message */}
        {err && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
              {err}
            </div>
          </div>
        )}
        {/* Loading State */}
        {loading && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
              Processing...
            </div>
          </div>
        )}

        {/* Left Panel */}
        <div className="w-full md:w-1/3 flex-col items-center justify-center bg-gradient-to-br from-red-600 to-red-800 p-8 text-white flex">
          <FaExclamationTriangle size={64} />
          <h2 className="mt-4 text-center text-2xl font-bold">Danger Zone</h2>
          <p className="mt-2 text-center text-sm text-red-100">
            This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Delete</h2>
            <button
              onClick={() => setIsDeleteConfirmPopup1Visible(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
              title="Close"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleDelete} className="space-y-8 p-8">
            {/* Password Input */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 text-gray-900 placeholder-transparent transition-colors focus:border-red-500 focus:outline-none"
                placeholder="Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all 
                  peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base 
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-red-600 cursor-text"
              >
                <span className="inline-flex items-center gap-2">
                  <FaLock /> Password
                </span>
              </label>
            </div>

            {/* TYPE CONFIRM Input */}
            <div className="relative">
              <input
                id="confirmText"
                name="confirmText"
                type="text"
                value={formData.confirmText}
                onChange={handleChange}
                className="peer h-11 w-full rounded-md border-2 border-gray-300 px-3 uppercase tracking-wider text-gray-900 placeholder-transparent transition-colors focus:border-red-500 focus:outline-none"
                placeholder='Type "CONFIRM"'
                required
              />
              <label
                htmlFor="confirmText"
                className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm peer-focus:text-red-600 cursor-text"
              >
                <span className="inline-flex items-center gap-2">
                  <FaExclamationTriangle className="inline-flex items-center gap-2" />{" "}
                  Type "CONFIRM"
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmPopup1Visible(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold cursor-pointer text-white shadow-md transition-transform hover:scale-105 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDel;

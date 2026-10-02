import React, { useState, useMemo, useEffect } from "react";
import { FaTimes, FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLockBodyScroll } from "../utils/UtilFuncs";
import { changePasswordSelf } from "../../service/auth";

// Stable, reusable password field
const PasswordField = ({
  label,
  name,
  icon,
  showKey,
  value,
  onChange,
  show,
  setShow,
  hasError,
}) => (
  <div className="mb-6">
    <div className="relative flex items-center">
      <input
        id={name}
        name={name}
        type={show[showKey] ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer h-11 w-full rounded-md border-2 px-3 pr-10 text-gray-900 focus:outline-none transition-all
          ${
            hasError
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-indigo-600"
          }`}
        required
      />

      {/* Floating label */}
      <label
        htmlFor={name}
        className={`absolute left-3 bg-white px-1 transition-all duration-200 cursor-text
          ${value ? "-top-3 text-sm text-indigo-600" : "top-2.5 text-gray-500"}
          peer-focus:-top-3 peer-focus:text-sm peer-focus:text-indigo-600`}
      >
        <span className="inline-flex items-center gap-2">
          {icon} {label}
        </span>
      </label>

      {/* Eye toggle */}
      <button
        type="button"
        onClick={() =>
          setShow((prev) => ({ ...prev, [showKey]: !prev[showKey] }))
        }
        className="absolute right-3 text-gray-400 hover:text-gray-600"
        style={{ transform: "translateY(-50%)", top: "50%" }}
        tabIndex={-1}
      >
        {show[showKey] ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

    {hasError && (
      <p className="mt-1 text-xs text-red-600">Passwords don’t match.</p>
    )}
  </div>
);

const ChangePassPopup = ({ setChangePassPopupVisible }) => {
  useLockBodyScroll(true);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [myTimeout, setMyTimeout] = useState(null);

  useEffect(() => {
    return () => clearTimeout(myTimeout);
  }, [myTimeout]);

  const passwordsMatch =
    formData.newPassword.trim() === formData.confirmPassword.trim();

  const isValid = useMemo(() => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    return Boolean(
      currentPassword.trim() &&
        newPassword.trim() &&
        confirmPassword.trim() &&
        passwordsMatch
    );
  }, [formData, passwordsMatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErr("");
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await changePasswordSelf(formData);
      console.log(res.data);
      setSuccessMsg(res.data);
      setMyTimeout(
        setTimeout(() => {
          setChangePassPopupVisible(false);
        }, 3000)
      );
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setChangePassPopupVisible(false)}
    >
      <div
        className="flex flex-col md:flex-row w-full max-w-3xl animate-slide-down-fade overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel */}
        <div className="flex w-full md:w-1/3 flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white">
          <FaKey size={72} />
          <h2 className="mt-4 text-2xl font-bold">Secure Update</h2>
          <p className="mt-2 text-sm text-indigo-100 text-center">
            Choose a strong password you don’t use elsewhere.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Change Password
            </h2>
            <button
              onClick={() => setChangePassPopupVisible(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
              title="Close"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Error / Loading / Success */}
          {err && (
            <div className="mx-8 mt-4 rounded-lg bg-red-100 px-4 py-3 text-red-700 border border-red-300">
              {err}
            </div>
          )}
          {loading && (
            <div className="mx-8 mt-4 rounded-lg bg-blue-100 px-4 py-3 text-blue-700 border border-blue-300">
              Processing...
            </div>
          )}
          {successMsg && (
            <div className="mx-8 mt-4 rounded-lg bg-green-100 px-4 py-3 text-green-700 border border-green-300">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleChangePassword} className="p-8">
            <PasswordField
              label="Current Password"
              name="currentPassword"
              icon={<FaLock />}
              showKey="current"
              value={formData.currentPassword}
              onChange={handleChange}
              show={show}
              setShow={setShow}
              hasError={false}
            />
            <PasswordField
              label="New Password"
              name="newPassword"
              icon={<FaKey />}
              showKey="new"
              value={formData.newPassword}
              onChange={handleChange}
              show={show}
              setShow={setShow}
              hasError={false}
            />
            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              icon={<FaKey />}
              showKey="confirm"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={show}
              setShow={setShow}
              hasError={formData.confirmPassword && !passwordsMatch}
            />

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => setChangePassPopupVisible(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md hover:scale-105 hover:bg-indigo-700 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassPopup;

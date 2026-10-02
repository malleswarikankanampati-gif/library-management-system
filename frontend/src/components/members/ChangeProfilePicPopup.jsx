import React, { useEffect, useRef, useState } from "react";
import { useLockBodyScroll } from "../utils/UtilFuncs";
import { changeProfilePic, removeProfilePic } from "../../service/auth";
import { useDispatch, useSelector } from "react-redux";
import { getMemberDetailsLocal } from "../../app/features/auth/authSlice";
import { dummyMemberAvatar } from "../../assets/dummyData";
import { FaTimes } from "react-icons/fa";

const ChangeProfilePicPopup = ({ setChangeProfilePicPopup }) => {
  useLockBodyScroll(true);

  const dispatch = useDispatch();
  const { member } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [errorTimerId, setErrorTimerId] = useState(null);

  useEffect(() => {
    return () => {
      clearTimeout(errorTimerId);
    };
  }, [errorTimerId]);

  const showTempError = (msg) => {
    setErr(msg);
    setErrorTimerId(setTimeout(() => setErr(""), 3000));
  };

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("memberImg", file);
    setLoading(true);
    try {
      const res = await changeProfilePic(formData);
      console.log(res.data);
      dispatch(getMemberDetailsLocal());
      setChangeProfilePicPopup(false);
    } catch (error) {
      console.error("Error:", error);
      showTempError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
      e.target.value = "";
    } finally {
      setLoading(false);
    }
  };

  const removeDp = async () => {
    setLoading(true);
    try {
      const res = await removeProfilePic();
      console.log(res.data);
      dispatch(getMemberDetailsLocal());
      setChangeProfilePicPopup(false);
    } catch (error) {
      console.error("Error:", error);
      showTempError(
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
      onClick={() => setChangeProfilePicPopup(false)}
    >
      {/* Popup content container */}
      <div
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {err && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
              Error: {err}
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

        {/* Close button */}
        <button
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full cursor-pointer text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
          onClick={() => setChangeProfilePicPopup(false)}
          aria-label="Close"
        >
          <FaTimes size={16} />
        </button>

        {/* Popup header */}
        <h2 className="text-2xl font-bold text-gray-800">
          Change Profile Photo
        </h2>

        {/* Profile image with clean border gap */}
        <div className="mt-5 flex justify-center">
          <div className="relative w-64 h-64 rounded-full bg-gray-50 border-2 border-gray-300 shadow-sm p-1">
            <img
              src={member.memberImg || dummyMemberAvatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = dummyMemberAvatar;
              }}
              alt="Member Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col gap-3">
          {/* Upload button */}
          <button
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 font-medium text-blue-600 transition-colors duration-200 hover:bg-gray-50 hover:text-blue-700 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            Upload Photo
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Remove button */}
          <button
            onClick={removeDp}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 font-medium text-red-600 transition-colors duration-200 hover:bg-gray-50 hover:text-red-700 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                clipRule="evenodd"
              />
            </svg>
            Remove Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicPopup;

import React, { useEffect } from "react";
import { useLockBodyScroll } from "./UtilFuncs";

const WarningDel = ({
  heading = "Are you sure you want to delete this item?",
  text = "This action cannot be undone.",
  onDelete,
  onCancel,
}) => {
  useLockBodyScroll(true);

  return (
    <div
      onClick={onCancel}
      className="fixed p-4 inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 rounded-lg"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-xl max-w-2xl text-center shadow-2xl border border-gray-200 animate-fadeIn"
      >
        {/* Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M1 12a11 11 0 1122 0 11 11 0 01-22 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Warning!</h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-8 text-base leading-relaxed px-2">
          {heading}
          <span className="block font-medium text-red-500 mt-2">{text}</span>
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-6 rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg font-medium transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningDel;

import React, { useState } from "react";
import { updateOtherStatus } from "../../service/auth";

const UpdateStatusPopup = ({
  memberId,
  memberName,
  currentStatus,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = useState(currentStatus || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!status) {
      setErr("Please select a status");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await updateOtherStatus({ memberId, status });
      console.log(res.data);
      onSuccess();
      onClose();
    } catch (e) {
      setErr(
        e.response?.data?.message || e.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8 z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white p-12 shadow-2xl transition-all duration-300 transform opacity-100 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-500 hover:text-red-500 hover:border-red-400 transition-all duration-200 cursor-pointer"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title & Description */}
        <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-left whitespace-normal break-words">
          Update Membership Status
        </h2>
        <p className="text-base text-gray-600 mb-8">
          Change the status for{" "}
          <span className="font-semibold text-red-600">{memberName}</span>
        </p>

        {/* Status Dropdown */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="status-select"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Select Status
            </label>
            <div className="relative">
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full appearance-none border border-black/50 bg-orange-100 py-3 pl-5 pr-12 text-lg transition-all duration-200 outline-none text-red-950"
              >
                <option value="" disabled>
                  -- Please select an option --
                </option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="EXPIRED">Expired</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {err && (
              <p className="mt-4 text-base font-medium text-red-600">{err}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl px-6 py-3 text-base font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="relative rounded-xl bg-orange-600 px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusPopup;

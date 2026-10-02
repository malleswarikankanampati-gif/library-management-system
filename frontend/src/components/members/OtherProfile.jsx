import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaUserTag,
} from "react-icons/fa";
import { dummyMemberAvatar } from "../../assets/dummyData";
import { useNavigate, useParams } from "react-router-dom";
import { getBorrowHistoryByMemberId } from "../../service/borrowHistory";
import { getOtherMemberDetails } from "../../service/auth";
import ListBorrowByMemberPopup from "../borrow/ListBorrowByMemberPopup";
import UpdateStatusPopup from "./UpdateStatusPopup";
import SelfActivity from "./SelfActivity";

const OtherProfile = () => {
  const { member } = useSelector((state) => state.auth);

  const [otherMember, setOtherMember] = useState(null);
  const [loadingInner, setLoadingInner] = useState(false);
  const [err, setErr] = useState("");

  const [borrowPopupOpen, setBorrowPopupOpen] = useState(false);
  const [updateStatusPopupOpen, setUpdateStatusPopupOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (member.memberId == id) {
      navigate("/member", { replace: true });
    }
    getAll();
  }, [id]);

  const getAll = async () => {
    setLoadingInner(true);
    try {
      const resMember = await getOtherMemberDetails(id);
      setOtherMember(resMember.data);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      );
    } finally {
      setLoadingInner(false);
    }
  };

  if (!otherMember) {
    return (
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
        <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      {err && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
            Error: {err}
          </div>
        </div>
      )}
      {loadingInner && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
            Loading...
          </div>
        </div>
      )}

      <div className="flex justify-center items-center p-6">
        {/* Centered content grid */}
        <div className="mx-auto grid min-w-[80%] 2xl:w-[80%] grid-cols-1 gap-16 lg:grid-cols-5 mt-5">
          {/* --- LEFT COLUMN - PROFILE CARD (40% width on lg screens) --- */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-white text-center shadow-lg">
              {/* Gradient Banner */}
              <div className="h-28 bg-gradient-to-br from-orange-400 to-red-500" />

              {/* Avatar - Overlapping the banner */}
              <div className="relative mx-auto -mt-16 h-28 w-28 rounded-full border-4 border-white">
                <img
                  src={otherMember.memberImg || dummyMemberAvatar}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    if (e.target.src !== dummyMemberAvatar) {
                      e.target.src = dummyMemberAvatar;
                    }
                  }}
                  alt="Member Avatar"
                  className="h-full w-full rounded-full object-cover shadow-md transition-all duration-300"
                />
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {otherMember.firstName} {otherMember.lastName}
                </h1>
                {otherMember.username && (
                  <p className="text-sm text-gray-500">
                    @{otherMember.username}
                  </p>
                )}

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      otherMember.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {otherMember.status}
                  </span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4 border-t border-gray-200 p-6 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaIdBadge /> Member ID
                  </span>
                  <span className="font-mono text-gray-700">
                    {otherMember.memberId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaEnvelope /> Email
                  </span>
                  <span className="text-gray-700">{otherMember.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaUserTag /> Role
                  </span>
                  <span className="text-gray-700 capitalize">
                    {otherMember.roleNames
                      .map((role) => role.split("_")[1].toLowerCase())
                      .join(", ")}
                  </span>
                </div>
                {/* Member since row */}
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaCalendarAlt /> Member since
                  </span>
                  <span className="text-gray-700">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaLock /> Password
                  </span>
                  <span className="text-gray-700">********</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN - ACCOUNT SETTINGS (60% width on lg screens) --- */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold tracking-wide text-gray-900">
                  Account Settings
                </h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-7 w-7 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="mt-2 text-base text-gray-500">
                Manage and view all member accounts, including profiles, status,
                and permissions.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {/* Borrow Button */}
                <button
                  onClick={() => setBorrowPopupOpen(true)}
                  className="group flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818l-.879-.659c-.379-.284-.848-.522-1.354-.727A17.567 17.567 0 015.118 7.94c-.369-.47-.246-1.15.218-1.492l.75-.515C7.585 5.176 8.35 4.88 9.172 4.646A17.583 17.583 0 0112 4.5c.725 0 1.45.064 2.158.197.822.234 1.587.527 2.31.917l.75.515c.464.342.587 1.022.218 1.492a17.567 17.567 0 01-2.614 3.003c-.506.205-.975.443-1.354.727L12 14.182V6M12 6a8.96 8.96 0 016.386 2.766M12 6a8.96 8.96 0 00-6.386 2.766M12 18a8.96 8.96 0 01-6.386-2.766M12 18a8.96 8.96 0 006.386-2.766"
                        />
                      </svg>
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      Borrow
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400 group-hover:text-orange-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>

                {/* Update Status Button */}
                <button
                  onClick={() => setUpdateStatusPopupOpen(true)}
                  className="group flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 9.75v4.5m0-4.5a3 3 0 11-3.75-3.69M15 9.75a3 3 0 10-3.75 3.69M12 12a3 3 0 11-3.75-3.69M12 12v4.5m-3 2.818l.879.659c1.154.865 3.125 1.724 4.195 1.724 2.105 0 2.502-.26 2.502-1.954V10.5m-6 4.5h3m-3 0h-3.75m-3.75 0h-.75V15m3-6h.75m-3.75 0h-.75V9m3 4.5h.75m-3.75 0h-.75"
                        />
                      </svg>
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      Update Status
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-400 group-hover:text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {borrowPopupOpen && (
        <ListBorrowByMemberPopup
          memberId={otherMember.memberId}
          memberName={`${otherMember.firstName} ${otherMember.lastName}`}
          onClose={() => setBorrowPopupOpen(false)}
        />
      )}

      {updateStatusPopupOpen && (
        <UpdateStatusPopup
          memberId={otherMember.memberId}
          memberName={`${otherMember.firstName} ${otherMember.lastName}`}
          currentStatus={otherMember.status}
          onClose={() => setUpdateStatusPopupOpen(false)}
          onSuccess={getAll}
        />
      )}

      <SelfActivity id={id} />
    </div>
  );
};

export default OtherProfile;

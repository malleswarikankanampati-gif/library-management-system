import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaEdit,
  FaKey,
  FaShieldAlt,
  FaUserTag,
  FaTrash,
  FaPencilAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiChevronRight, FiLogOut } from "react-icons/fi";
import { dummyMemberAvatar } from "../../assets/dummyData";
import MemberEditPopup from "./MemberEditPopup";
import { useNavigate } from "react-router-dom";
import WarningDel from "../utils/WarningDel";
import {
  allLogout,
  getMemberDetailsLocal,
} from "../../app/features/auth/authSlice";
import ConfirmDel from "./ConfirmDel";
import {
  deleteMemberSelf,
  setPasswordSelf,
  updateUserNameSelf,
} from "../../service/auth";
import ChangePassPopup from "./ChangePassPopup";
import ChangeProfilePicPopup from "./ChangeProfilePicPopup";
import { listBorrowBooksByMember } from "../../service/borrow";
import BookCard from "../book/BookCard";
import { FaArrowRight } from "react-icons/fa6";
import SelfActivity from "./SelfActivity";

const LoadingDots = () => (
  <div className="flex items-center gap-1 px-2 py-1.5 mt-2">
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const ErrorBadge = ({ message, clear }) => {
  useEffect(() => {
    const timer = setTimeout(clear, 3000);
    return () => clearTimeout(timer);
  }, [clear]);

  return (
    <div
      onClick={clear}
      className="inline-flex items-center mt-2 px-2 py-1 rounded bg-red-50 border border-red-100 cursor-pointer animate-in fade-in zoom-in duration-200"
    >
      <span className="text-[10px] font-medium text-red-500 uppercase tracking-wider">
        {message}
      </span>
    </div>
  );
};

const MyProfile = () => {
  const { member, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [isLogoutPopoutVisible, setIsLogoutPopoutVisible] = useState(false);
  const [isDeleteConfirmPopup1Visible, setIsDeleteConfirmPopup1Visible] =
    useState(false);
  const [isDeleteConfirmPopup2Visible, setIsDeleteConfirmPopup2Visible] =
    useState(false);
  const [changePassPopupVisible, setChangePassPopupVisible] = useState(false);
  const [changeProfilePicPopup, setChangeProfilePicPopup] = useState(false);
  const [changeUsernamePopup, setChangeUsernamePopup] = useState(false);

  const [books, setBooks] = useState([]);
  const [totalBorrowBooks, setTotalBorrowBooks] = useState(0);
  const [loadingInner, setLoadingInner] = useState(false);
  const [loadingInnerChnageUsername, setLoadingInnerChnageUsername] =
    useState(false);
  const [err, setErr] = useState("");
  const [errChnageUsername, setErrChnageUsername] = useState("");
  const [setPasswordPopup, setSetPasswordPopup] = useState(false);
  const [loadingSetPassword, setLoadingSetPassword] = useState(false);
  const [errSetPassword, setErrSetPassword] = useState("");

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const updateUserName = async (username) => {
    setLoadingInnerChnageUsername(true);
    try {
      const res = await updateUserNameSelf({ username });
      dispatch(getMemberDetailsLocal());
    } catch (err) {
      console.log(err);
      setErrChnageUsername(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while updating username.",
      );
    } finally {
      setLoadingInnerChnageUsername(false);
    }
  };

  const updatePassword = async (password) => {
    setLoadingSetPassword(true);
    try {
      const res = await setPasswordSelf({ password });
      dispatch(getMemberDetailsLocal());
    } catch (err) {
      console.log(err);
      setErrSetPassword(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while setting password.",
      );
    } finally {
      setLoadingSetPassword(false);
    }
  };

  const renderUsernameSection = useMemo(() => {
    if (loadingInnerChnageUsername) return <LoadingDots />;

    if (errChnageUsername) {
      return (
        <>
          <div className="max-w-80">
            <ErrorBadge
              message={errChnageUsername}
              clear={() => setErrChnageUsername("")}
            />
          </div>
        </>
      );
    }

    if (member.username) {
      return (
        <p className="text-sm text-gray-500 font-medium">@{member.username}</p>
      );
    }

    if (changeUsernamePopup) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const username = new FormData(e.currentTarget).get("username");
            if (username) updateUserName(username);
            setChangeUsernamePopup(false);
          }}
          className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-1 duration-200"
        >
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 text-xs">@</span>
            <input
              type="text"
              name="username"
              autoFocus
              placeholder="username"
              className="pl-7 pr-3 py-1.5 w-40 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none transition-all focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="submit"
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setChangeUsernamePopup(false)}
              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </form>
      );
    }

    return (
      <button
        onClick={() => setChangeUsernamePopup(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium transition-all duration-200 ease-in-out hover:bg-red-100 hover:text-red-700 mt-2 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Username
      </button>
    );
  }, [
    member.username,
    changeUsernamePopup,
    loadingInnerChnageUsername,
    errChnageUsername,
  ]);

  const renderPasswordSetSection = useMemo(() => {
    if (loadingSetPassword) return <LoadingDots />;

    if (errSetPassword) {
      return (
        <>
          <div className="max-w-50">
            <ErrorBadge
              message={errSetPassword}
              clear={() => setErrSetPassword("")}
            />
          </div>
        </>
      );
    }

    // If password is already set, show a masked display
    if (member.isPasswordSet) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span className="tracking-widest">••••••••</span>
          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 uppercase tracking-tight">
            Set
          </span>
        </div>
      );
    }

    if (setPasswordPopup) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const password = new FormData(e.currentTarget).get("password");
            if (password) updatePassword(password);
            setSetPasswordPopup(false);
          }}
          className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-1 duration-200"
        >
          <div className="relative flex items-center">
            <input
              type="password"
              name="password"
              autoFocus
              placeholder="New password"
              className="px-3 py-1.5 w-40 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none transition-all focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="submit"
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSetPasswordPopup(false)}
              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </form>
      );
    }

    return (
      <button
        onClick={() => setSetPasswordPopup(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium transition-all duration-200 ease-in-out hover:bg-red-100 hover:text-red-700 mt-2 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        Set Password
      </button>
    );
  }, [
    member.isPasswordSet,
    setPasswordPopup,
    loadingSetPassword,
    errSetPassword,
  ]);

  const fetchBorrowedBooks = async () => {
    setLoadingInner(true);
    try {
      const res = await listBorrowBooksByMember(member.memberId, 4);
      setTotalBorrowBooks(res.data.page.totalElements);
      setBooks(res.data.content || []);
    } catch (err) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while fetching borrowed books.",
      );
    } finally {
      setLoadingInner(false);
    }
  };

  const deleteSelfMember = async () => {
    setLoadingInner(true);
    try {
      const res = await deleteMemberSelf();
      console.log(res.data);
      dispatch(allLogout());
      navigate("/");
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

  const ActionItem = ({
    icon,
    title,
    description,
    onClick,
    accentColor = "bg-orange-100 text-orange-600",
  }) => (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-300 hover:bg-slate-100 hover:shadow-sm cursor-pointer"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accentColor}`}
      >
        {icon}
      </div>

      <div className="flex-grow">
        <p className="font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <FiChevronRight
        className="shrink-0 text-gray-400 transform transition-transform duration-300 group-hover:translate-x-1"
        size={20}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-orange-600 font-medium">
        Loading profile...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-500 italic">
        No profile data available
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
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
            Processing...
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
              <div
                onClick={() => setChangeProfilePicPopup(true)}
                className="relative group mx-auto -mt-16 h-28 w-28 cursor-pointer rounded-full border-4 border-white"
              >
                <img
                  src={member.memberImg || dummyMemberAvatar}
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
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-80">
                  <FaPencilAlt className="text-white text-2xl" />
                </div>
              </div>

              {/* Member Info */}
              <div className="p-6 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {member.firstName} {member.lastName}
                </h1>
                {renderUsernameSection}

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      member.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.status}
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
                    {member.memberId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaEnvelope /> Email
                  </span>
                  <span className="text-gray-700">{member.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 font-medium text-gray-500">
                    <FaUserTag /> Role
                  </span>
                  <span className="text-gray-700 capitalize">
                    {member.roleNames
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
                  <span className="text-gray-700">
                    {renderPasswordSetSection}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN - ACCOUNT SETTINGS (60% width on lg screens) --- */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
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
              <p className="mt-1 text-sm text-gray-500">
                Manage your profile, password, and account preferences.
              </p>

              <div className="mt-8 space-y-6">
                {/* Profile Actions */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-4">
                    Profile
                  </h3>
                  <div className="mt-2 space-y-2">
                    <ActionItem
                      icon={<FaEdit size={20} />}
                      title="Edit Profile"
                      description="Update your personal information."
                      onClick={() => setIsEditPopupVisible(true)}
                    />
                  </div>
                </div>

                {/* Security Actions */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-4">
                    Security
                  </h3>
                  <div className="mt-2 space-y-2">
                    <ActionItem
                      icon={<FaKey size={20} />}
                      title="Change Password"
                      description="It's a good idea to use a strong password."
                      onClick={() => setChangePassPopupVisible(true)}
                    />
                    <ActionItem
                      icon={<FaShieldAlt size={20} />}
                      title="Two-Factor Authentication"
                      description="Add an extra layer of security to your account."
                      onClick={() => alert("2FA feature yet to be implemented")}
                      accentColor="bg-sky-100 text-sky-600"
                    />
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    Danger Zone
                  </h3>
                  <div className="mt-2 space-y-2">
                    <ActionItem
                      icon={<FiLogOut size={20} />}
                      title="Logout"
                      description="You will be returned to the login screen."
                      onClick={() => setIsLogoutPopoutVisible(true)}
                      accentColor="bg-red-100 text-red-600"
                    />
                    <ActionItem
                      icon={<FaTrash size={20} />}
                      title="Delete My Account"
                      description="Permanently remove your account and all data."
                      onClick={() => setIsDeleteConfirmPopup1Visible(true)}
                      accentColor="bg-red-100 text-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Render the modern popup */}
      {isEditPopupVisible && (
        <MemberEditPopup
          member={member}
          setIsEditPopupVisible={setIsEditPopupVisible}
          dispatch={dispatch}
          navigate={navigate}
        />
      )}

      {isLogoutPopoutVisible && (
        <WarningDel
          heading="Are you sure you want to logout?"
          text="You can log back in any time"
          onDelete={() => {
            dispatch(allLogout());
            navigate("/");
          }}
          onCancel={() => setIsLogoutPopoutVisible(false)}
        />
      )}

      {isDeleteConfirmPopup1Visible && (
        <ConfirmDel
          setIsDeleteConfirmPopup1Visible={setIsDeleteConfirmPopup1Visible}
          setIsDeleteConfirmPopup2Visible={setIsDeleteConfirmPopup2Visible}
        />
      )}

      {isDeleteConfirmPopup2Visible && (
        <WarningDel
          heading="Are you sure you want to delete your account?"
          text="This action cannot be undone and you will lose all your data."
          onDelete={deleteSelfMember}
          onCancel={() => setIsDeleteConfirmPopup2Visible(false)}
        />
      )}

      {changePassPopupVisible && (
        <ChangePassPopup
          setChangePassPopupVisible={setChangePassPopupVisible}
        />
      )}

      {changeProfilePicPopup && (
        <ChangeProfilePicPopup
          setChangeProfilePicPopup={setChangeProfilePicPopup}
        />
      )}

      {/* Borrowed Books Content */}
      {!loadingInner && !err && books.length > 0 && (
        <div className="mt-6 px-20 mx-auto w-[90%]">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-extrabold text-orange-600 flex items-center gap-2">
              <FaArrowRight className="text-2xl mr-3" />
              Borrowed Books
            </h3>
          </div>
          <div className="flex flex-wrap justify-start gap-y-8 gap-x-12">
            {books.map((book, index) => (
              <BookCard key={index} book={book} isBorrowedPage={true} />
            ))}
            {totalBorrowBooks > 4 && (
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate("/borrow")}
                  className="inline-flex items-center px-6 py-3
                bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                text-white font-semibold rounded-full shadow-md cursor-pointer
                transition-all duration-200 ease-in-out transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <span className="mr-2">Show All</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <SelfActivity />
    </div>
  );
};

export default MyProfile;

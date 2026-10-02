import React, { useEffect, useState } from "react";
import { FaChevronDown, FaFilter, FaTimes } from "react-icons/fa";

const DrawerMember = ({ setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState("");
  const [errorTimerId, setErrorTimerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeField, setActiveField] = useState("");

  const [memberId, setMemberId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    return () => {
      clearTimeout(errorTimerId);
    };
  }, [errorTimerId]);

  useEffect(() => {
    const fields = [
      { name: "memberId", value: memberId },
      { name: "username", value: username },
      { name: "email", value: email },
    ];

    const active = fields.find((f) => f.value && f.value.trim());

    if (active) {
      setIsDisabled(true);
      setActiveField(active.name);
    } else {
      setIsDisabled(false);
      setActiveField(null);
    }
  }, [memberId, username, email]);

  const showTempError = (msg) => {
    setErr(msg);
    setErrorTimerId(setTimeout(() => setErr(""), 4000));
  };

  const checkValidEmail = () => {
    const value = email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailPattern.test(value)) {
      showTempError("Invalid email format");
      return false;
    } else {
      return true;
    }
  };

  const checkValidMembaerId = () => {
    const value = memberId;
    const numberPattern = /^[0-9]+$/;
    if (value && !numberPattern.test(value)) {
      showTempError("ID should be numeric");
      return false;
    } else {
      return true;
    }
  };

  const handleApply = () => {
    if (checkValidMembaerId() && checkValidEmail()) {
      setFilters({
        memberId: memberId ? Number(memberId) : null,
        firstName,
        lastName,
        email,
        status: status || null,
        username,
      });
      toggleDrawer();
    }
  };

  const handleClear = () => {
    setMemberId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setStatus("");
    setUsername("");
    setIsDisabled(false);
    setActiveField("");
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 z-10 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "#00000080" }}
        onClick={toggleDrawer}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 bg-red-950 text-orange-100 border-orange-500 w-64 transform transition-transform duration-300 pt-14 z-20 border-r  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-orange-500">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={toggleDrawer} className="text-xl cursor-pointer">
            <FaTimes />
          </button>
        </div>

        {/* Error Banner (inline) */}
        {err && (
          <div className="mx-2 mt-4 mb-3 p-3 rounded-lg bg-green-500/20 border border-green-400 text-green-200 text-sm">
            <strong>Error:</strong> {err}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-6 text-center text-amber-300 animate-pulse">
            Loading...
          </div>
        )}

        <ul className="space-y-6 p-4 min-h-[75vh] text-sm">
          {/* Member ID */}
          <li>
            <label htmlFor="memberId" className="block font-medium mb-1 mt-1">
              Member ID
            </label>
            <input
              type="text"
              placeholder="Enter Member ID"
              name="memberId"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg placeholder:italic bg-red-900 border border-orange-600 outline-none"
              disabled={isDisabled && activeField != "memberId"}
            />
          </li>

          {/* Username */}
          <li>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-red-900 border border-orange-600 outline-none placeholder:italic"
              disabled={isDisabled && activeField != "username"}
            />
          </li>

          {/* Email */}
          <li>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-red-900 border border-orange-600 outline-none placeholder:italic"
              disabled={isDisabled && activeField != "email"}
            />
          </li>

          <div className="mb-8 mt-10 border-b border-orange-500" />

          {/* Membership Status */}
          <li className="relative">
            <label className="block font-medium mb-1">Membership Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full appearance-none px-3 py-2 pr-10 rounded-lg bg-red-900 border border-orange-600 outline-none placeholder:italic
                ${status ? "" : "italic text-orange-100/55"}`}
              disabled={isDisabled && activeField != "status"}
            >
              <option value="" className="italic text-orange-100/55">
                Select Status
              </option>
              <option value="ACTIVE" className="text-orange-100 not-italic">
                Active
              </option>
              <option value="INACTIVE" className="text-orange-100 not-italic">
                Inactive
              </option>
              <option value="SUSPENDED" className="text-orange-100 not-italic">
                Suspended
              </option>
              <option value="EXPIRED" className="text-orange-100 not-italic">
                Expired
              </option>
            </select>
            <FaChevronDown
              className={`absolute right-3 top-9 pointer-events-none
                ${status ? "" : "text-orange-100/55"}`}
              size={14}
            />
          </li>

          {/* First Name */}
          <li>
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-red-900 border border-orange-600 outline-none placeholder:italic"
              disabled={isDisabled && activeField != "firstName"}
            />
          </li>

          {/* Last Name */}
          <li>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-red-900 border border-orange-600 outline-none placeholder:italic"
              disabled={isDisabled && activeField != "lastName"}
            />
          </li>
        </ul>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-orange-700 flex justify-evenly items-center gap-6">
          <button
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out cursor-pointer"
            onClick={handleApply}
          >
            Apply
          </button>
          <button
            className="bg-orange-700 hover:bg-orange-600 text-amber-100 font-semibold py-2 px-6 rounded-lg shadow-md border border-orange-500 transition-all duration-200 ease-in-out cursor-pointer"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Button to toggle the drawer */}
      <button
        onClick={toggleDrawer}
        className={`fixed top-1/2 text-orange-100 bg-red-900 p-4 pl-2 rounded-r-4xl z-30 h-16 transform transition-all duration-300 border border-l-0 flex items-center justify-center border-orange-500
          ${
            isOpen
              ? "left-64 opacity-0 pointer-events-none"
              : "left-0 cursor-pointer"
          }`}
      >
        <FaFilter />
      </button>
    </div>
  );
};

export default DrawerMember;

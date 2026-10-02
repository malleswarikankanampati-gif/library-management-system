import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import ListAccountDropdown from "./account/ListAccountDropdown";
import ListAdminDropdown from "./account/ListAdminDropdown";
import ListGenres from "../genre/ListGenres";
import BookSearch from "./BookSearch";
import AuthorSearch from "./AuthorSearch";
import { dummyMemberAvatar } from "../../assets/dummyData";
import { isCurrentUserLibrarian } from "../../app/features/auth/authSlice";

const Navbar = ({ isAuthenticated }) => {
  const { member } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();
  const genreRef = useRef();
  const profileLogoRef = useRef();
  const adminNavItemRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchText, setSetsearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const setAllOpenFalse = () => {
    setIsOpen(false);
    setIsAccountOpen(false);
    setIsAdminOpen(false);
  };

  useEffect(() => {
    setSetsearchText("");
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (location.pathname.includes("/authors")) {
      navigate(`/authors?name=${searchText}`);
    } else {
      if (location.pathname.includes("/books")) {
        const params = new URLSearchParams(location.search);
        params.set("title", searchText);
        params.delete("page");
        params.delete("size");
        params.delete("sort");
        params.delete("asc");
        navigate(`/books?${params.toString()}`);
      } else {
        navigate(`/books?title=${searchText}`);
      }
    }

    setSetsearchText("");
  };

  const navLinkClasses = ({ isActive }) =>
    `transition-all text-sm font-medium px-3 py-2 rounded-md ${
      isActive
        ? "bg-white/20 text-white"
        : "text-orange-100 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="px-4 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink
          onClick={setAllOpenFalse}
          to="/"
          className="text-2xl font-bold text-white hover:text-yellow-100 transition tracking-wide"
        >
          BookNest
        </NavLink>

        {/* Navigation */}
        <ul className="flex items-center space-x-2 md:space-x-4 text-white">
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex relative items-center gap-2 pr-6"
          >
            <label className="flex items-center text-white translate-x-8">
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-white text-sm" />
              ) : (
                <FaSearch className="text-white text-sm" />
              )}
            </label>
            <input
              ref={searchRef}
              type="text"
              className="w-[260px] pl-10 pr-3 py-1 rounded-md border border-white/30 bg-white/10 text-white placeholder-white/70 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/20 transition"
              value={searchText}
              onChange={(e) => setSetsearchText(e.target.value)}
              placeholder={`Enter name of ${
                location.pathname.includes("/authors") ? "author..." : "book..."
              }`}
            />
            {!location.pathname.includes("/authors") ? (
              <BookSearch
                searchText={searchText}
                handleSearch={handleSearch}
                setLoading={setLoading}
                searchRef={searchRef}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <AuthorSearch
                searchText={searchText}
                handleSearch={handleSearch}
                setLoading={setLoading}
                searchRef={searchRef}
                isAuthenticated={isAuthenticated}
              />
            )}
          </form>

          {/* Navigation Links */}

          <li>
            <NavLink
              to="/books"
              className={navLinkClasses}
              onClick={setAllOpenFalse}
            >
              Books
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/authors"
              className={navLinkClasses}
              onClick={setAllOpenFalse}
            >
              Authors
            </NavLink>
          </li>
          <li className="relative">
            <button
              ref={genreRef}
              className="text-orange-100 hover:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-white/10 transition cursor-pointer"
              onClick={(e) => {
                setIsAdminOpen(false);
                setIsAccountOpen(false);
                setIsOpen(!isOpen);
              }}
            >
              Genres
            </button>
            {isOpen && (
              <ListGenres
                setIsOpen={setIsOpen}
                isAuthenticated={isAuthenticated}
                genreRef={genreRef}
              />
            )}
          </li>

          <li>
            <NavLink
              to="/about"
              className={navLinkClasses}
              onClick={setAllOpenFalse}
            >
              About
            </NavLink>
          </li>

          {/* Admin Dropdown */}
          {isCurrentUserLibrarian(member) && (
            <li className="relative">
              <button
                ref={adminNavItemRef}
                className="text-orange-100 hover:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-white/10 transition cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  setIsAccountOpen(false);
                  setIsAdminOpen(!isAdminOpen);
                }}
              >
                Admin
              </button>
              {isAdminOpen && (
                <ListAdminDropdown
                  setIsAdminOpen={setIsAdminOpen}
                  adminNavItemRef={adminNavItemRef}
                />
              )}
            </li>
          )}
        </ul>

        {/* Profile Avatar */}
        <div className="relative flex items-center ml-4">
          {isAuthenticated && member ? (
            <button
              ref={profileLogoRef}
              className="h-9 w-9 rounded-full overflow-hidden border-2 border-white hover:border-yellow-300 transition-all duration-300 shadow cursor-pointer"
              title={`${member.firstName} ${member.lastName}`}
              onClick={() => {
                setIsAdminOpen(false);
                setIsOpen(false);
                setIsAccountOpen(!isAccountOpen);
              }}
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
                className="h-full w-full object-cover"
              />
            </button>
          ) : (
            <button
              ref={profileLogoRef}
              className="h-9 w-9 rounded-full overflow-hidden border-2 border-white hover:border-yellow-300 transition-all duration-300 shadow cursor-pointer"
              onClick={() => {
                setIsAdminOpen(false);
                setIsOpen(false);
                setIsAccountOpen(!isAccountOpen);
              }}
            >
              <img
                src={dummyMemberAvatar}
                alt="Member Avatar"
                className="h-full w-full object-cover"
              />
            </button>
          )}
          {isAccountOpen && (
            <ListAccountDropdown
              setIsAccountOpen={setIsAccountOpen}
              profileLogoRef={profileLogoRef}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

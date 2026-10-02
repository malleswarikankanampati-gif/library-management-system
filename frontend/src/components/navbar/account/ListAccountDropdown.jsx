import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { allLogout } from "../../../app/features/auth/authSlice";
import { useEffect, useRef } from "react";

const ListAccountDropdown = ({
  setIsAccountOpen,
  profileLogoRef,
  isAuthenticated,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !profileLogoRef.current?.contains(e.target)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef}>
      {isAuthenticated ? (
        <ul
          className="absolute right-0 mt-6 w-56 origin-top-right z-50 bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900"
          onClick={() => setIsAccountOpen(false)}
        >
          <li>
            <Link
              to="/member"
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block"
            >
              My Profile
            </Link>
          </li>

          <li>
            <Link
              to="/borrow"
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block"
            >
              Borrowed Books
            </Link>
          </li>

          <li>
            <Link
              to="/wishlist"
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block"
            >
              Your Wishlist
            </Link>
          </li>

          <li>
            <Link
              to="/request-book"
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block"
            >
              Request Book
            </Link>
          </li>

          <li>
            <button
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block w-full text-left"
              onClick={() => {
                dispatch(allLogout());
                navigate("/");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <ul
          className="absolute right-0 mt-6 w-56 origin-top-right z-50 bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900"
          onClick={() => setIsAccountOpen(false)}
        >
          <li>
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block"
            >
              Login
            </Link>
          </li>

          <li>
            <Link
              to="/register"
              className="rounded-lg px-4 py-2 hover:bg-amber-100 block"
            >
              Register
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ListAccountDropdown;

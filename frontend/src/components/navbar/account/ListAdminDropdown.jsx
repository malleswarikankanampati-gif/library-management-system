import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ListAdminDropdown = ({ setIsAdminOpen, adminNavItemRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !adminNavItemRef.current?.contains(e.target)
      ) {
        setIsAdminOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef}>
      <ul
        className="absolute right-0 mt-1 w-56 origin-top-right ring-1 ring-black/5 focus:outline-none z-50  bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900 translate-x-[35%]"
        onClick={() => {
          setIsAdminOpen(false);
        }}
      >
        <li>
          <Link
            to="/add-book"
            className="rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize block"
          >
            Add New Book
          </Link>
        </li>
        <li>
          <Link
            to="/add-author"
            className="rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize block"
          >
            Add New Author
          </Link>
        </li>
        <li>
          <Link
            to="/add-genre"
            className="rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize block"
          >
            Add New Genre
          </Link>
        </li>
        <li>
          <Link
            to="/all-member"
            className="rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize block"
          >
            All Members
          </Link>
        </li>
        <li>
          <Link
            to="/pending-borrow"
            className="rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize block"
          >
            Pending Borrowed Books
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ListAdminDropdown;

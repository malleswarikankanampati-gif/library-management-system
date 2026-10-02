import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/features/category/categorySlice";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { isCurrentUserLibrarian } from "../../app/features/auth/authSlice";

const ListGenres = ({ setIsOpen, isAuthenticated, genreRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !genreRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!isAuthenticated) {
    return (
      <div
        ref={containerRef}
        className="absolute right-0 mt-2 w-56 origin-top-right z-50  bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900 translate-x-[30%]"
      >
        <div className="flex flex-col items-center text-center px-6 py-6">
          <div className="text-3xl mb-2">🔒</div>

          <p className="text-sm font-semibold text-gray-800">
            Sign in to discover genres
          </p>

          <p className="text-xs text-gray-400 mt-1 leading-relaxed tracking-wide">
            Login to discover books, authors and more
          </p>
        </div>
      </div>
    );
  } else {
    const { member } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(
      (state) => state.categories,
    );

    const navigate = useNavigate();

    useEffect(() => {
      dispatch(fetchCategories());
    }, [dispatch]);

    const getAllParams = (genre) => {
      const currentURL = window.location.href;

      if (currentURL.includes("/books")) {
        const url = new URL(currentURL);

        const params = new URLSearchParams(url.search);
        params.set("categoriesIds", genre.categoryId);

        navigate(`/books?${params.toString()}`);
      } else {
        navigate(`/books?categoriesIds=${genre.categoryId}`);
      }
    };

    return (
      <div ref={containerRef}>
        <ul className="absolute right-0 mt-1 w-56 origin-top-right z-50  bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900 translate-x-[34%]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <div className="w-6 h-6 border-2 border-orange-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 tracking-wide">
                Loading genres...
              </p>
            </div>
          )}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
              <div className="text-2xl mb-1">⚠️</div>
              <p className="text-sm font-semibold text-red-600">
                Failed to load genres
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Please try again later
              </p>
            </div>
          )}
          {!loading && !error && (
            <>
              {categories.map((genre, index) => (
                <li
                  key={index}
                  className="rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize flex justify-between gap-4"
                  onClick={() => {
                    getAllParams(genre);
                    setIsOpen(false);
                  }}
                  title={genre.description}
                >
                  {genre.name.toLowerCase()}
                  {isCurrentUserLibrarian(member) && (
                    <div
                      className="flex items-center justify-center rounded-lg hover:text-orange-700 z-40 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the parent onClick from being triggered
                        setIsOpen(false);
                        navigate(`/edit-genre/${genre.categoryId}`);
                      }}
                    >
                      <AiFillEdit />
                    </div>
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    );
  }
};

export default ListGenres;

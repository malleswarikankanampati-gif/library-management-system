import React, { useEffect, useRef, useState } from "react";
import { listAllAuthors } from "../../service/author";
import { defaultAuthorImg } from "../../assets/dummyData";
import { useLocation, useNavigate } from "react-router-dom";

const AuthorSearch = ({
  searchText,
  handleSearch,
  setLoading,
  searchRef,
  isAuthenticated,
}) => {
  const boxRef = useRef(null);

  const [authors, setAuthors] = useState([]);
  const [err, setErr] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setDebouncedSearchText("");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        boxRef.current &&
        searchRef.current &&
        !boxRef.current.contains(event.target) &&
        !searchRef.current.contains(event.target)
      ) {
        setDebouncedSearchText("");
      } else if (
        searchRef.current &&
        searchRef.current.contains(event.target)
      ) {
        if (!debouncedSearchText) {
          setDebouncedSearchText(searchText);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchText, debouncedSearchText]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
      // setDebouncedSearchText("");
    };
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearchText) {
      getAuthors();
    }
  }, [debouncedSearchText]);

  const getAuthors = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await listAllAuthors(debouncedSearchText);
      setAuthors(res.data.content);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {debouncedSearchText && (
        <div
          ref={boxRef}
          className="absolute -right-4 mt-2 w-[260px] origin-top-right ring-1 ring-black/5 focus:outline-none z-50 top-full mr-10 bg-amber-50 shadow-lg rounded-md border border-gray-300"
        >
          {!isAuthenticated ? (
            <div className="flex flex-col items-center text-center px-6 py-6">
              <div className="text-3xl mb-2">🔒</div>

              <p className="text-sm font-semibold text-gray-800">
                Sign in to search authors
              </p>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed tracking-wide">
                Login to discover books, authors and more
              </p>
            </div>
          ) : (
            <>
              {/* Display error message */}
              {err && (
                <div className="text-center py-4 text-red-500">
                  <span>{err}</span>
                </div>
              )}

              {/* Display the authors list */}
              {!err && authors.length > 0 && (
                <ul
                  className="max-h-96 overflow-y-auto"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {authors.map((author) => (
                    <li
                      key={author.authorId}
                      className="flex justify-between items-center px-4 py-3 border-b border-orange-400 hover:bg-amber-100 cursor-pointer gap-4"
                      onClick={() => {
                        setDebouncedSearchText("");
                        setAuthors([]);
                        setErr("");
                        navigate(`/authors/${author.authorId}`);
                      }}
                    >
                      {/* Author Image */}
                      <img
                        src={author.authorImg || defaultAuthorImg}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultAuthorImg;
                        }}
                        alt={author.name}
                        className="w-16 h-20 object-cover rounded-md bg-orange-300"
                      />

                      {/* Author Info */}
                      <div className="ml-3 flex flex-col w-48">
                        <span className="font-semibold text-sm text-gray-800">
                          {author.name}
                        </span>
                        <span className="mt-2 text-xs text-gray-600 line-clamp-3">
                          {author.biography}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Funtionality to submit */}
          <div className="text-center px-2 py-4 text-gray-500 text-sm border-t border-gray-200">
            <button
              onClick={(e) => {
                handleSearch(e);
                setDebouncedSearchText("");
                setAuthors([]);
                setErr("");
              }}
              className="cursor-pointer hover:text-orange-800 hover:underline underline-offset-4 text-nowrap truncate w-full"
            >{`Show all results for ( ${searchText} )`}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthorSearch;

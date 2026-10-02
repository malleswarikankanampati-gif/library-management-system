import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryParam } from "../book/ListBooks";

const Pagination = ({
  size,
  page,
  totalElements,
  totalPages,
  filters,
  sort,
  asc,
}) => {
  if (totalElements <= 0) {
    return null;
  }

  const navigate = useNavigate();
  const location = useLocation();

  const inputRef = useRef(null);
  const [pageInput, setPageInput] = useState(page + "");

  useEffect(() => {
    const curpage = getQueryParam("page");
    curpage && setPageInput(curpage + "");
  }, [location]);

  const handleChange = (e) => {
    changePage(e.target.value, false, "sort");
  };

  const handleSizeChange = (e) => {
    changePage(e.target.value, false, "size");
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  useEffect(() => {
    if (page > totalPages) {
      changePage(totalPages, true);
    }
  }, []);

  const changePage = (newPage, replace = false, page = "page") => {
    const params = new URLSearchParams(location.search);
    params.set(page, newPage);
    navigate(`${location.pathname}?${params.toString()}`, { replace });
  };

  const handlePageClick = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && newPage != page) {
      changePage(newPage);
    }
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - (maxPagesToShow - 1));
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChangeSubmit = (e) => {
    e.preventDefault();
    let pageInputTrim = pageInput.trim();
    if (
      !isNaN(pageInputTrim) &&
      pageInputTrim !== "" &&
      pageInputTrim > 0 &&
      pageInputTrim != page
    ) {
      changePage(pageInputTrim);
    } else {
      setPageInput(page + "");
      inputRef.current?.blur();
    }
  };

  const handleAscChange = () => {
    changePage(!asc, false, "asc");
  };

  return (
    <div className="py-10 lg:px-20 flex flex-row-reverse flex-wrap items-center justify-between gap-2 mt-6 text-sm text-gray-700">
      <div className="flex flex-wrap-reverse items-center justify-end gap-8">
        <div className="flex justify-center items-center gap-2">
          <div className="font-bold">Sort By :</div>

          <select
            value={sort}
            onChange={handleChange}
            className="px-3 py-1 border rounded bg-white text-gray-700 focus:bg-gray-100 outline-none"
          >
            {filters.map((filter, index) => (
              <option key={index} value={filter}>
                {filter
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
          <button
            onClick={handleAscChange}
            className="px-2 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {asc ? "▲" : "▼"}
          </button>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="font-bold">Size :</div>

          <select
            value={size}
            onChange={handleSizeChange}
            className="px-3 py-1 border rounded bg-white text-gray-700 focus:bg-gray-100 outline-none"
          >
            {[10, 20, 30, 40, 50, 100].map((s, index) => (
              <option key={index} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {totalPages > 1 ? (
          <div className="flex gap-1">
            <button
              onClick={() => handlePageClick(1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="First Page"
            >
              ◀◀
            </button>
            <button
              onClick={() => handlePageClick(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="Prev"
            >
              ◀
            </button>

            {getPageNumbers().map((num) => {
              if (num === page) {
                return (
                  <form onSubmit={(e) => handlePageChangeSubmit(e)} key={num}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={pageInput}
                      onFocus={handleFocus}
                      onChange={(e) => setPageInput(e.target.value + "")}
                      className="px-3 py-1 w-16 border rounded focus:bg-blue-100 focus:text-blue-700 outline-none text-center bg-blue-600 text-white font-bold border-blue-600"
                    />
                  </form>
                );
              } else {
                return (
                  <button
                    key={num}
                    onClick={() => handlePageClick(num)}
                    className={`px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100`}
                  >
                    {num}
                  </button>
                );
              }
            })}

            <button
              onClick={() => handlePageClick(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="Next"
            >
              ▶
            </button>
            <button
              onClick={() => handlePageClick(totalPages)}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="Last Page"
            >
              ▶▶
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              disabled
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="First Page"
            >
              ◀◀
            </button>
            <button
              disabled
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="Prev"
            >
              ◀
            </button>

            <button
              disabled
              className={`px-3 py-1 w-16 border rounded text-center bg-blue-600 text-white font-bold border-blue-600`}
            >
              1
            </button>

            <button
              disabled
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="Next"
            >
              ▶
            </button>
            <button
              disabled
              className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed"
              title="Last Page"
            >
              ▶▶
            </button>
          </div>
        )}
      </div>

      <div>
        Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> (
        {" " + totalElements} results )
      </div>
    </div>
  );
};

export default Pagination;

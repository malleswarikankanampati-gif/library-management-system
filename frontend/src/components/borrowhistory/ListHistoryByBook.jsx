import React, { useEffect, useState, useRef } from "react";
import {
  getAllSortingFilters,
  getBorrowHistoryByBookId,
} from "../../service/borrowHistory";
import HistoryIndvLog from "./HistoryIndvLog";
import PaginationPost from "../utils/PaginationPost";
import { FaArrowCircleDown, FaArrowDown } from "react-icons/fa";

const ListHistoryByBook = ({ bookId, onClose }) => {
  const [history, setHistory] = useState();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const [pagination, setPagination] = useState();
  const [pagiChangeToggle, setPagiChangeToggle] = useState(0);

  useEffect(() => {
    getAll();
  }, [pagiChangeToggle]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await getBorrowHistoryByBookId(bookId, pagination);
      console.log(res.data);
      setHistory(res.data);
      setPagination({
        page: res.data.page,
        size: res.data.size,
        sort: res.data.sort,
        asc: res.data.asc,
      });
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div
        ref={modalRef}
        className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl border border-gray-200 overflow-y-auto max-h-[80vh] no-scrollbar"
      >
        {/* Close button */}
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

        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
          Borrow History
        </h2>

        {loading && (
          <p className="text-blue-600 text-center mb-4">Loading...</p>
        )}
        {err && <p className="text-red-600 text-center mb-4">{err}</p>}
        {!loading && !err && history?.content?.length === 0 && (
          <p className="text-gray-600 italic text-center mb-4">
            No history found
          </p>
        )}
        {history && !loading && !err && history?.content?.length !== 0 && (
          <ul className="space-y-3">
            {history?.content?.map((hist, id) => (
              <HistoryIndvLog key={id} hist={hist} onClose={onClose} />
            ))}

            {history?.hasNext && (
              <div className="flex justify-center w-full mt-4">
                <button
                  onClick={() => {
                    setPagination((prev) => ({
                      ...prev,
                      size: prev.size + 10,
                    }));
                    setPagiChangeToggle((p) => p + 1);
                  }}
                  aria-label="Load more history"
                  title="Load more history"
                  className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm transition-all duration-300 ease-out hover:border-orange-400 hover:shadow-md hover:bg-orange-50/60 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400/30 group cursor-pointer"
                >
                  {/* Subtle soft halo on hover */}
                  <span className="absolute inset-0 rounded-full bg-orange-100 opacity-0 group-hover:opacity-20 ransition-opacity duration-300" />

                  {/* Icon */}
                  <FaArrowDown className="text-gray-400 h-6 transition-all duration-300 group-hover:text-orange-500 group-hover:translate-y-0.5 group-hover:h-7" />
                </button>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListHistoryByBook;

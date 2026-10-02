import React, { useContext, useEffect, useRef, useState } from "react";
import HistoryIndvLog from "../borrowhistory/HistoryIndvLog";
import PaginationPost from "../utils/PaginationPost";
import {
  getAllSortingFilters,
  getBorrowHistoryByMemberId,
  getBorrowHistoryForSelf,
} from "../../service/borrowHistory";
import { ScrollContext } from "../utils/context/ScrollContext";

const SelfActivity = ({ id = null }) => {
  const scrollRef = useContext(ScrollContext);

  const [history, setHistory] = useState();
  const [pagination, setPagination] = useState();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [pagiChangeToggle, setPagiChangeToggle] = useState(0);
  const activityRef = useRef(null);

  useEffect(() => {
    getSortFilters();
  }, []);

  useEffect(() => {
    getAll();
  }, [pagiChangeToggle]);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = id
        ? await getBorrowHistoryByMemberId(id, pagination)
        : await getBorrowHistoryForSelf(pagination);
      setHistory(res.data || null);
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
          "An unexpected error occurred",
      );
    } finally {
      setLoading(false);

      if (scrollRef.current && pagiChangeToggle != 0 && !id) {
        setTimeout(() => {
          activityRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 1);
      }
    }
  };

  const getSortFilters = async () => {
    try {
      const res = await getAllSortingFilters();
      setFilters(res.data || []);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      );
    }
  };

  return (
    <div>
      {/* Activity Section */}
      <div
        ref={activityRef}
        className="mt-20 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg  p-6 mb-10 border-t-4 border-t-orange-600 scroll-mt-14"
      >
        {err && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300 mt-4 mb-8">
            ERROR: {err}
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Activity
          </h3>
          <span className="text-sm text-gray-500">Recent actions</span>
        </div>

        {/* Activity List */}
        <ul className="space-y-3">
          {loading || !history ? (
            // ⏳ Loading State
            <div className="p-4 flex items-center justify-center text-gray-500 bg-gray-50 rounded-md animate-pulse">
              <svg
                className="animate-spin h-5 w-5 text-orange-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Loading activity...
            </div>
          ) : !loading && history?.content?.length === 0 ? (
            // 📭 No Data Found
            <div className="p-4 flex items-center justify-center text-gray-500 bg-gray-50 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2h6v2m-7-7h8m-8 4h8m-5 4h2"
                />
              </svg>
              No activity found
            </div>
          ) : (
            // ✅ Data List
            history?.content?.map((hist, id) => (
              <div
                key={id}
                className="p-4 border-l-4 border-l-orange-600 rounded-md bg-orange-50"
              >
                <HistoryIndvLog hist={hist} />
              </div>
            ))
          )}
        </ul>
      </div>

      {history && !loading && (
        <div className="mt-10 mb-8">
          <PaginationPost
            size={history.size}
            page={history.page}
            totalElements={history.totalElements}
            totalPages={history.totalPages}
            first={history.first}
            last={history.last}
            hasNext={history.hasNext}
            hasPrevious={history.hasPrevious}
            sort={history.sort}
            asc={history.asc}
            filters={filters}
            setPagination={setPagination}
            setPagiChangeToggle={setPagiChangeToggle}
          />
        </div>
      )}
    </div>
  );
};

export default SelfActivity;

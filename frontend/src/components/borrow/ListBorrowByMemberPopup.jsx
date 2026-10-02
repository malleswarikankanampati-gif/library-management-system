import React, { useEffect, useState } from "react";
import { listBorrowBooksByMember } from "../../service/borrow";
import { useNavigate } from "react-router-dom";
import { defaultImg } from "../../assets/dummyData";

const ListBorrowByMemberPopup = ({ memberId, memberName, onClose }) => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await listBorrowBooksByMember(memberId);
      setBooks(res.data.content || []);
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
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-200 overflow-y-auto max-h-[70vh] no-scrollbar"
        onClick={(e) => e.stopPropagation()}
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

        {/* Header */}
        <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-center whitespace-normal break-words">
          Books Borrowed by {memberName}
        </h2>

        {/* Alerts */}
        {loading && (
          <div className="text-center text-blue-600 font-medium mb-4">
            Loading...
          </div>
        )}
        {err && (
          <div className="text-center text-red-600 font-medium mb-4">{err}</div>
        )}
        {!loading && !err && books.length === 0 && (
          <div className="text-center text-yellow-600 italic mb-4">
            No books found...
          </div>
        )}

        {/* Book List */}
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.bookId}
              onClick={() => {
                onClose();
                navigate(`/books/${book.bookId}`);
              }}
              className="flex items-center gap-4 bg-orange-50 border cursor-pointer border-orange-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={book.bookCoverImg || defaultImg}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImg;
                }}
                alt={book.title}
                className="w-12 h-12 rounded-full object-cover border border-orange-300"
              />

              <div className="flex flex-col">
                <p className="text-orange-800 font-bold text-lg ">
                  {book.title}
                </p>
                <p className="text-sm text-gray-600">By {book.authorName}</p>
              </div>

              <div className="ml-auto text-right flex-shrink-0 pl-6 border-l border-orange-600">
                <p className="text-sm text-gray-500">Borrowed for</p>
                <p
                  className={`text-lg font-bold text-orange-600 ${
                    book.borrowedDays >= 30 && "animate-pulse text-orange-800"
                  }`}
                >
                  {book.borrowedDays <= 1
                    ? "1 day"
                    : book.borrowedDays + " days"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListBorrowByMemberPopup;

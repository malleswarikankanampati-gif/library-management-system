import React from "react";
import { defaultImg } from "../../assets/dummyData";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book, isBorrowedPage = false }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/books/${book.bookId}`)}
      className={`flex flex-col items-center bg-white rounded-lg shadow-lg hover:shadow-2xl w-72 h-auto overflow-hidden hover:bg-gray-100 transition duration-300 cursor-pointer hover:scale-105 ${
        book.availableCopies === 0 && !isBorrowedPage && "opacity-55"
      }`}
    >
      {/* Book Cover Image (rectangular) */}
      <img
        src={book.bookCoverImg || defaultImg}
        alt={book.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImg;
        }}
        className="w-full h-48 object-contain rounded-t-lg border-2 border-orange-500 bg-orange-200"
      />

      {isBorrowedPage && book.borrowedDays >= 7 && book.borrowedDays < 30 && (
        <div className="mt-2 flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-md text-sm font-medium shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Borrowed for{" "}
          <span className="font-semibold">{book.borrowedDays}</span>{" "}
          {book.borrowedDays === 1 ? "day" : "days"}
        </div>
      )}

      {isBorrowedPage && book.borrowedDays >= 30 && (
        <div
          role="alert"
          className="mt-2 inline-flex max-w-4/5 mx-auto items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 shadow-sm animate-pulse"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5 shrink-0 text-red-600"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16h.01" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>

          <span className="leading-tight">
            Overdue: <span className="font-bold">{book.borrowedDays}</span> days
            !!!
          </span>
        </div>
      )}

      {/* Book Title, Author Name, and Publication Year */}
      <div className="flex flex-col items-center mt-4 px-4 mb-4">
        <h2 className="text-xl font-semibold text-orange-700 text-center">
          {book.title}
        </h2>
        <p className="text-sm text-gray-500 mt-2">{book.authorName}</p>
      </div>
      {/* Book Stats */}
      <div className="flex justify-between w-full px-4 py-2 bg-gray-50 mt-auto">
        <p className="text-sm text-gray-600">
          Total Copies: {book.totalCopies}
        </p>
        <p className="text-sm text-gray-600">
          Available: {book.availableCopies}
        </p>
      </div>
    </div>
  );
};

export default BookCard;

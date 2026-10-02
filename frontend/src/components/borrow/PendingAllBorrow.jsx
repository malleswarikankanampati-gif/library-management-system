import React, { useEffect, useState } from "react";
import { getAllPendingBorrow } from "../../service/borrow";
import { defaultImg, dummyMemberAvatar } from "../../assets/dummyData";
import { useNavigate } from "react-router-dom";

const PendingAllBorrow = () => {
  const [borrow, setBorrow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredBorrow, setFilteredBorrow] = useState([]);

  useEffect(() => {
    getAllPending();
  }, []);

  useEffect(() => {
    if (filter === "lt7") {
      setFilteredBorrow(borrow.filter((b) => b.book?.borrowedDays < 7));
    } else if (filter === "7to30") {
      setFilteredBorrow(
        borrow.filter((b) => {
          const d = b.book?.borrowedDays;
          return d >= 7 && d <= 30;
        })
      );
    } else if (filter === "gt30") {
      setFilteredBorrow(borrow.filter((b) => b.book?.borrowedDays > 30));
    } else {
      setFilteredBorrow(borrow);
    }
  }, [filter]);

  const getAllPending = async () => {
    setLoading(true);
    try {
      const res = await getAllPendingBorrow();
      setBorrow(res.data || []);
      setFilteredBorrow(res.data || []);
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
    <div className="py-10 px-4 min-h-screen">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4 capitalize">
          All Borrowed Books
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
      </div>

      {/* Alerts Section */}
      <div className="mx-auto w-full max-w-md px-4 mb-8">
        {loading && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-orange-100 text-orange-700 border border-orange-300 animate-pulse font-medium">
            Loading...
          </div>
        )}
        {err && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
            {err}
          </div>
        )}
        {!loading && !err && borrow.length === 0 && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-green-100 text-green-800 border border-green-300">
            No borrowed books found.
          </div>
        )}
      </div>

      {/* Borrowed Books Grid Content */}
      {!loading && !err && borrow.length > 0 && (
        <div>
          <div className="w-full flex justify-center mb-10 gap-4 flex-wrap">
            <button className="px-4 py-2 rounded-full text-sm font-medium border bg-white text-gray-700 border-orange-300">
              Borrowed Days
            </button>

            <div className="h-10 border border-orange-400"></div>

            <button
              onClick={() => setFilter(filter === "lt7" ? "" : "lt7")}
              className={`px-4 py-2 rounded-full text-sm font-medium border text-gray-700 hover:bg-orange-50 cursor-pointer hover:shadow-lg duration-300
                 ${
                   filter === "lt7"
                     ? "bg-orange-100 border-orange-400"
                     : "bg-white/80 border-orange-300"
                 }`}
            >
              Less than 7 days
            </button>

            <button
              onClick={() => setFilter(filter === "7to30" ? "" : "7to30")}
              className={`px-4 py-2 rounded-full text-sm font-medium border text-gray-700 hover:bg-orange-50 cursor-pointer hover:shadow-lg duration-300
                 ${
                   filter === "7to30"
                     ? "bg-orange-100 border-orange-400"
                     : "bg-white/80 border-orange-300"
                 }`}
            >
              Between 7 and 30 days
            </button>

            <button
              onClick={() => setFilter(filter === "gt30" ? "" : "gt30")}
              className={`px-4 py-2 rounded-full text-sm font-medium border text-gray-700 hover:bg-orange-50 cursor-pointer hover:shadow-lg duration-300
                 ${
                   filter === "gt30"
                     ? "bg-orange-100 border-orange-400"
                     : "bg-white/80 border-orange-300"
                 }`}
            >
              Greater than 30 days
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-8 gap-x-12 md:px-20 px-5">
            {filteredBorrow.map((item, index) => {
              const { book, member } = item;

              return (
                <div
                  key={`${book?.bookId}-${member?.memberId}-${index}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-orange-300 cursor-pointer"
                >
                  {/* --- Top Section: Book Info --- */}
                  <div
                    onClick={() =>
                      window.open(`/books/${book?.bookId}`, "_blank")
                    }
                    className="p-5 flex gap-5 flex-grow relative group"
                  >
                    {/* Decorative background circle */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(255,200,150,0.6),rgba(255,150,50,0))] rounded-bl-full -z-0"></div>

                    {/* Book Cover */}
                    <div className="flex-shrink-0 z-10">
                      <img
                        src={book?.bookCoverImg || defaultImg}
                        alt={book?.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}
                        className="w-28 h-40 object-cover rounded-lg shadow-sm border border-orange-100 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Book Text Details */}
                    <div className="flex flex-col justify-between w-full z-10">
                      <div>
                        <h2
                          className="text-xl font-bold text-gray-800 line-clamp-2 break-all"
                          title={book?.title}
                        >
                          {book?.title}
                        </h2>
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={`/authors/${book?.authorId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-orange-600 mt-1 font-semibold hover:text-orange-700 hover:underline underline-offset-2"
                        >
                          {book?.authorName}
                        </a>
                        <p className="text-xs text-gray-400 mt-1">
                          {book?.publisher} • {book?.publicationYear}
                        </p>
                      </div>

                      {/* Badges Container */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {/* Borrowed Days Badge (Added Here) */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-300">
                          Borrowed Days: {book?.borrowedDays}
                        </span>

                        {/* Copies Available Badge */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                          Copies: {book?.availableCopies} / {book?.totalCopies}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* --- Bottom Section: Member Info --- */}
                  <div
                    onClick={() =>
                      window.open(`/member/${member?.memberId}`, "_blank")
                    }
                    className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-300 p-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Member Avatar */}
                      <img
                        src={member?.memberImg || dummyMemberAvatar}
                        alt={`${member.firstName} ${member.lastName}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = dummyMemberAvatar;
                        }}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Member Text */}
                      <div className="flex flex-col">
                        <span className="text-xs text-orange-600 font-semibold uppercase tracking-wide">
                          Borrowed By
                        </span>
                        <p className="text-base font-bold text-gray-800 capitalize">
                          {member?.firstName} {member?.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Action / Status Badge */}
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border shadow-sm
                      ${
                        member?.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-200 text-red-700 border-red-300"
                      }`}
                      >
                        {member?.status || "MEMBER"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAllBorrow;

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  decreaseTotal,
  deleteBook,
  getOneBook,
  increateTotal,
} from "../../service/book";
import { defaultImg } from "../../assets/dummyData";
import WarningDel from "../utils/WarningDel";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FaAnglesRight } from "react-icons/fa6";
import {
  addBookToWishlist,
  deleteBookFromWishlist,
} from "../../service/wishlist";
import { useSelector } from "react-redux";
import { addBookToBorrow, deleteBookFromBorrow } from "../../service/borrow";
import AutoLogoutPopup from "../utils/AutoLogoutPopup";
import ListMembersByBorrow from "../members/ListMembersByBorrow";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ListHistoryByBook from "../borrowhistory/ListHistoryByBook";
import { isCurrentUserLibrarian } from "../../app/features/auth/authSlice";

const BookPage = () => {
  const { member } = useSelector((state) => state.auth);

  const changeFormRef = useRef(null);

  const [book, setBook] = useState(null);
  const [err, setErr] = useState("");
  const [wishlistErr, setWishlistErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);
  const [isWishlistAdded, setIsWishlistAdded] = useState(false);
  const [borrowedDays, setBorrowedDays] = useState(-1);
  const [checkMemberPopupOpen, setCheckMemberPopupOpen] = useState(false);
  const [checkHistoryPopupOpen, setCheckHistoryPopupOpen] = useState(false);

  const [tempValue, setTempValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [isPlus, setIsPlus] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!inputVisible) return;

    const handleClickOutside = (event) => {
      if (
        changeFormRef.current &&
        !changeFormRef.current.contains(event.target)
      ) {
        setTempValue("");
        setInputVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputVisible]);

  useEffect(() => {
    getOne();
  }, [id]);

  useEffect(() => {
    let timer;

    if (showSuccessMessage || wishlistErr) {
      timer = setTimeout(() => {
        setShowSuccessMessage(null);
        setWishlistErr("");
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessMessage, wishlistErr]);

  const getOne = async () => {
    try {
      const res = await getOneBook(id);
      setBook(res.data);
      setIsWishlistAdded(res.data.isWishlist);
      setBorrowedDays(res.data.borrowedDays);
    } catch (error) {
      console.error(error);
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      );
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteBook(id);
      alert(res.data);
      navigate("/books");
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred while deleting book.",
      );
    } finally {
      setLoading(false);
    }
    setWarning(null);
  };

  const handleChangeTotal = async (plus, amt) => {
    setLoading(true);
    try {
      const res = plus
        ? await increateTotal(id, amt)
        : await decreaseTotal(id, amt);
      getOne();
    } catch (err) {
      console.log(err);
      setWishlistErr(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while updating book.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSubmit = (e) => {
    e.preventDefault();
    if (!/^\d+$/.test(tempValue)) {
      setTempValue("Please enter a valid number");
      return;
    }
    setInputVisible(false);
    handleChangeTotal(isPlus, Number(tempValue));
    setTempValue("");
  };

  const handleAddToWishlist = async (isBorrow) => {
    setLoading(true);
    const data = { memberId: member.memberId, bookId: id };
    try {
      const res = isBorrow
        ? await addBookToBorrow(data)
        : await addBookToWishlist(data);
      setWishlistErr("");
      setShowSuccessMessage(
        <p>
          {isBorrow ? (
            <>
              {book.title} successfully borrowed. <br />
              Check{" "}
              <span
                onClick={() => navigate("/borrow")}
                className="underline underline-offset-4 cursor-pointer text-green-800 transition duration-200 hover:text-green-900"
              >
                Borrowed Books
              </span>
            </>
          ) : (
            <>
              Success: {book.title} successfully added to{" "}
              <span
                onClick={() => navigate("/wishlist")}
                className="underline underline-offset-4 cursor-pointer text-green-800 transition duration-200 hover:text-green-900"
              >
                wishlist
              </span>
            </>
          )}
        </p>,
      );
      isBorrow ? getOne() : setIsWishlistAdded(true);
    } catch (err) {
      console.log(err);
      setShowSuccessMessage(null);
      setWishlistErr(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while adding to wishlist / borrow.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromWishlist = async (isBorrow) => {
    setLoading(true);
    const data = { memberId: member.memberId, bookId: id };
    try {
      const res = isBorrow
        ? await deleteBookFromBorrow(data)
        : await deleteBookFromWishlist(data);
      setWishlistErr("");
      setShowSuccessMessage(
        <p>
          {isBorrow ? (
            <>
              {book.title} successfully returned. <br />
              Check{" "}
              <span
                onClick={() => navigate("/borrow")}
                className="underline underline-offset-4 cursor-pointer text-green-800 transition duration-200 hover:text-green-900"
              >
                Borrowed Books
              </span>
            </>
          ) : (
            <>
              {book.title} successfully removed from{" "}
              <span
                onClick={() => navigate("/wishlist")}
                className="underline underline-offset-4 cursor-pointer text-green-800 transition duration-200 hover:text-green-900"
              >
                wishlist
              </span>
            </>
          )}
        </p>,
      );
      isBorrow ? getOne() : setIsWishlistAdded(false);
    } catch (err) {
      console.log(err);
      setShowSuccessMessage(null);
      setWishlistErr(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while adding to wishlist / borrow.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!err && (!book || !member)) {
    return (
      <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
          Loading...
        </div>
      </div>
    );
  }

  if (err && (!book || !member)) {
    return (
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-100 to-orange-200 max-w-4/5 mx-auto p-8 min-h-full">
      {/* Book Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center min-h-[62vh]">
        {(err || wishlistErr) && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
              {err || wishlistErr}
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-green-100 text-green-800 border border-green-300">
              {showSuccessMessage}
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
              Loading...
            </div>
          </div>
        )}

        {/* Book Cover */}
        <div className="flex justify-center">
          <img
            src={book.bookCoverImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImg;
            }}
            alt={book.title}
            className="w-full max-w-md h-auto object-cover rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Book Details */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold mb-4 text-orange-600">
            {book.title}
          </h1>
          <h2 className="text-xl text-gray-800">
            by{" "}
            <Link
              to={`/authors/${book.authorId}`}
              className="underline underline-offset-2 hover:text-orange-600 duration-100"
            >
              {book.authorName}
            </Link>
          </h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-4 break-words whitespace-normal">
            {book.summary}
          </p>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <span className="font-semibold text-orange-800">
                📚 Publisher:
              </span>{" "}
              {book.publisher}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold text-orange-800">
                📚 Publication Year:
              </span>{" "}
              {book.publicationYear}
            </p>
            <div className="text-lg text-gray-700 flex flex-row justify-start gap-x-32">
              <p>
                <span className="font-semibold text-orange-800">
                  📚 Total Copies:
                </span>{" "}
                {book.totalCopies}
              </p>
              {isCurrentUserLibrarian(member) && (
                <div className="flex flex-row justify-start gap-6 text-2xl">
                  {inputVisible && (
                    <form
                      ref={changeFormRef}
                      className="absolute -translate-y-12 -translate-x-1/3 flex-row flex gap-2"
                      onSubmit={handleChangeSubmit}
                    >
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="p-2 w-56 outline-none bg-amber-50 shadow-lg rounded-lg text-sm border-2 border-orange-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center p-2 bg-amber-50 shadow-lg rounded-lg text-sm border-2 border-orange-500 text-orange-700 cursor-pointer
                      transition-all duration-200 ease-in-out hover:bg-orange-500 hover:text-amber-50"
                      >
                        <FaAnglesRight />
                      </button>
                    </form>
                  )}
                  <button className="flex items-center justify-center">
                    <FaPlusCircle
                      className="cursor-pointer hover:text-orange-800 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputVisible(true);
                        setIsPlus(true);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  </button>
                  <button className="flex items-center justify-center">
                    <FaMinusCircle
                      className="cursor-pointer hover:text-orange-800 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputVisible(true);
                        setIsPlus(false);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Availability Message */}
            {book.availableCopies === 0 ? (
              <p className="text-lg text-red-400 font-bold mt-4">
                🚫 No Available Copies. Please check again later.
              </p>
            ) : (
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-orange-800">
                  📚 Available Copies:
                </span>{" "}
                {book.availableCopies}
              </p>
            )}

            {/* Borrowed Info */}
            {borrowedDays > -1 && (
              <div className="mt-4 p-4 bg-orange-100 border-l-4 border-orange-600 rounded-md shadow-sm">
                <p className="text-orange-800 font-semibold text-lg">
                  ✅ You have borrowed this book.
                </p>
                <p className="text-gray-700 text-md font-semibold">
                  Number of days:{" "}
                  <span className="font-light">{borrowedDays}</span>
                </p>
              </div>
            )}
          </div>

          {/* Button Section */}
          <div className="mt-8 flex flex-col gap-6">
            {/* Primary Action Group: Borrow & Wishlist */}
            <div className="flex items-center gap-3 flex-wrap">
              {(book.availableCopies > 0 || borrowedDays > -1) && (
                <button
                  onClick={
                    borrowedDays === -1
                      ? () => handleAddToWishlist(true)
                      : () => handleDeleteFromWishlist(true)
                  }
                  className="group relative flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-orange-900/20 hover:bg-orange-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10">
                    {borrowedDays === -1 ? "Borrow Now" : "Return Book"}
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}

              <button
                onClick={
                  isWishlistAdded
                    ? () => handleDeleteFromWishlist(false)
                    : () => handleAddToWishlist(false)
                }
                title={
                  isWishlistAdded ? "Remove from Wishlist" : "Add to Wishlist"
                }
                className={`p-3.5 rounded-xl border-2 transition-all duration-300 flex items-center justify-center text-2xl shadow-sm cursor-pointer ${
                  isWishlistAdded
                    ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                    : "bg-gray-50 border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50"
                }`}
                aria-label={
                  isWishlistAdded ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                {isWishlistAdded ? (
                  <AiFillHeart className="scale-110" />
                ) : (
                  <AiOutlineHeart />
                )}
              </button>
            </div>

            {/* Librarian Management Section */}
            {isCurrentUserLibrarian(member) && (
              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">
                  Admin Management
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/edit-book/${book.bookId}`}
                    className="bg-white border border-blue-200 text-blue-600 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                  >
                    Edit Details
                  </Link>

                  <button
                    className="bg-white border border-purple-200 text-purple-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm cursor-pointer"
                    onClick={() => setCheckMemberPopupOpen(true)}
                  >
                    Check Status
                  </button>

                  <button
                    className="bg-white border border-indigo-200 text-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm cursor-pointer"
                    onClick={() => setCheckHistoryPopupOpen(true)}
                  >
                    View History
                  </button>

                  <button
                    className="ml-auto bg-red-50 text-red-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setWarning(
                        <WarningDel
                          onDelete={handleDelete}
                          onCancel={() => setWarning(null)}
                        />,
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Overlays / Modals */}
            {warning}
            {checkMemberPopupOpen && (
              <ListMembersByBorrow
                bookId={id}
                bookName={book.title}
                onClose={() => setCheckMemberPopupOpen(false)}
              />
            )}
            {checkHistoryPopupOpen && (
              <ListHistoryByBook
                bookId={id}
                onClose={() => setCheckHistoryPopupOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-orange-600 mb-4">
          Categories
        </h3>
        <div className="flex flex-wrap gap-4">
          {book.categoryDtos.map((dto, index) => (
            <span
              key={index}
              className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium border-2 border-orange-500 capitalize cursor-pointer"
              onClick={() => navigate(`/books?categoriesIds=${dto.categoryId}`)}
            >
              {dto.name.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookPage;

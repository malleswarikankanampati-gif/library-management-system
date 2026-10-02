import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { listWishlistBooksByMember } from "../../service/wishlist";
import BookCard from "../book/BookCard";

const Wishlist = () => {
  const { member } = useSelector((state) => state.auth);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlist = async () => {
    setLoading(true);
    try {
      const res = await listWishlistBooksByMember(member.memberId);
      setBooks(res.data);
    } catch (err) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while fetching books."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4 capitalize">
          Your Wishlist
        </h1>
        <hr className="border-t-4 border-orange-600 w-1/4 mx-auto" />
      </div>

      {/* Alerts Section */}
      <div className="mx-auto w-full max-w-md px-4 mb-6">
        {loading && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
            Loading...
          </div>
        )}
        {err && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
            {err}
          </div>
        )}
        {!loading && !err && books.length === 0 && (
          <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-yellow-50 text-yellow-800 border border-yellow-300">
            Your wishlist is empty.
          </div>
        )}
      </div>

      {/* Wishlist Content */}
      {!loading && !err && books.length > 0 && (
        <div className="flex flex-wrap justify-center gap-y-8 gap-x-12">
          {books.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

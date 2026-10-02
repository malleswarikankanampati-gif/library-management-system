import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteOneAuthor, getOneAuthor } from "../../service/author";
import { defaultAuthorImg } from "../../assets/dummyData";
import BookCard from "../book/BookCard";
import { getAllSortingFilters, listAllBooksFiltered } from "../../service/book";
import WarningDel from "../utils/WarningDel";
import { getQueryParam } from "../book/ListBooks";
import Pagination from "../utils/pagination";
import { useSelector } from "react-redux";
import { isCurrentUserLibrarian } from "../../app/features/auth/authSlice";

const AuthorPage = () => {
  const { member } = useSelector((state) => state.auth);

  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [books, setBooks] = useState([]);
  const [err, setErr] = useState("");
  const [warning, setWarning] = useState(null);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState("title");
  const [asc, setAsc] = useState("true");

  useEffect(() => {
    getSortFilters();
  }, []);

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

  useEffect(() => {
    getOne();
    getBooks();
  }, [id, location]);

  const getBooks = async () => {
    const page = getQueryParam("page");
    const size = getQueryParam("size");
    const sort = getQueryParam("sort");
    const asc = getQueryParam("asc");

    sort ? setSort(sort) : setSort("title");
    asc ? setAsc(asc) : setAsc("true");

    try {
      const res = await listAllBooksFiltered(
        null,
        id,
        null,
        null,
        null,
        null,
        null,
        page,
        size,
        sort,
        asc,
      );
      setPagination(res.data.page);
      setBooks(res.data.content);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      );
    }
  };

  const getOne = async () => {
    try {
      const res = await getOneAuthor(id);
      setData(res.data);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
      );
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteOneAuthor(id);
      alert(res.data);
      navigate("/authors");
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred while deleting author.",
      );
    }
    setWarning(null);
  };

  if (err) {
    return (
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-red-100 text-red-700 border border-red-300">
          {err}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="px-4 py-3 rounded-lg shadow-lg text-center bg-blue-100 text-blue-700 border border-blue-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-100 to-orange-200 max-w-4/5 mx-auto p-8 min-h-full">
      {/* Author Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
        {/* Author Image */}
        <div className="flex justify-center">
          <img
            src={data.authorImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAuthorImg;
            }}
            alt={data.name}
            className="w-full max-w-md h-auto object-cover rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105"
          />
        </div>
        {/* Author Details */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold mb-4 text-orange-600">
            {data.name}
          </h1>
          <p className="text-lg mb-4 text-gray-800 leading-relaxed">
            {data.biography}
          </p>
          {data.dob && (
            <p className="text-gray-500">
              Born on:{" "}
              {`${new Date(data.dob)
                .getDate()
                .toString()
                .padStart(2, "0")} ${new Date(data.dob).toLocaleString(
                "en-GB",
                { month: "long" },
              )}, ${new Date(data.dob).getFullYear()}`}
            </p>
          )}

          {/* Button Section */}
          {isCurrentUserLibrarian(member) && (
            <div className="mt-10 flex gap-10">
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 cursor-pointer w-28"
                onClick={() => navigate(`/edit-author/${data.authorId}`)}
              >
                Edit
              </button>
              <button
                className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-all duration-300 cursor-pointer w-28"
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
              {warning}
            </div>
          )}
        </div>
      </div>

      {/* Books Section */}
      <div>
        <h2 className="text-3xl font-semibold mb-6 text-orange-600">Books</h2>
        <hr className="border-t-2 border-orange-500 mb-10" />
        {books.length === 0 ? (
          <p className="text-lg">No books found. Please request a book.</p>
        ) : (
          <div className="flex justify-evenly flex-wrap gap-y-8 gap-x-12">
            {books.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        )}
      </div>
      {pagination && (
        <div className="mt-10">
          <Pagination
            size={pagination.size || 20}
            page={(pagination.number || 0) + 1}
            totalElements={pagination.totalElements}
            totalPages={pagination.totalPages}
            filters={filters}
            sort={sort}
            asc={asc === "true"}
          />
        </div>
      )}
    </div>
  );
};

export default AuthorPage;

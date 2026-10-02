import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "./BookCard";
import { fetchBooks } from "../../app/features/book/bookSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Drawer from "./Drawer";
import { getAllSortingFilters } from "../../service/book";
import Pagination from "../utils/pagination";
import { NoBookFounded } from "../../assets/dummyData";

export const isParamSet = () => {
  const params = new URLSearchParams(location.search);
  const allowed = ["page", "size", "sort", "asc"];

  for (const key of params.keys()) {
    if (!allowed.includes(key)) {
      return true;
    }
  }
  return false;
};

const ListBooks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { books, pagination, loading, error } = useSelector(
    (state) => state.books,
  );

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
    const title = getQueryParam("title");
    const authorId = getQueryParam("authorId");
    const categoriesIds = getQueryParam("categoriesIds");
    const publisher = getQueryParam("publisher");
    const fromDate = getQueryParam("fromDate");
    const tillDate = getQueryParam("tillDate");
    const availableCopies = getQueryParam("availableCopies");
    const page = getQueryParam("page");
    const size = getQueryParam("size");
    const sort = getQueryParam("sort");
    const asc = getQueryParam("asc");

    sort ? setSort(sort) : setSort("title");
    asc ? setAsc(asc) : setAsc("true");

    dispatch(
      fetchBooks({
        title,
        authorId,
        categoriesIds,
        publisher,
        fromDate,
        tillDate,
        availableCopies,
        page,
        size,
        sort,
        asc,
      }),
    );
  }, [dispatch, location]);

  if (loading) {
    return (
      <div className="text-center mt-8 text-gray-400 absolute top-28 w-full">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600 absolute top-28 w-full">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <Drawer />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4 capitalize">
          List of Books {isParamSet() && "( Filtered )"}
        </h1>
        <hr className="border-t-4 border-orange-600 w-1/4 mx-auto" />
      </div>
      {books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
          <div className="max-w-md">
            <img
              src={NoBookFounded}
              alt="No books found"
              className="w-full h-auto mx-auto mb-8 opacity-90 rounded-2xl"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No books found
            </h2>
            <p className="text-gray-600 mb-8">
              We couldn't find what you're looking for. Try adjusting your
              filters or searching for something else.
            </p>

            {isParamSet() && (
              <button
                onClick={() => navigate(location.pathname)}
                className="px-6 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-y-8 gap-x-12">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
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
    </div>
  );
};

export default ListBooks;

export const getQueryParam = (param) => {
  const params = new URLSearchParams(location.search);
  return params.get(param);
};

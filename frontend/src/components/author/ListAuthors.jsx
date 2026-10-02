import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthors } from "../../app/features/author/authorSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultAuthorImg, NoBookFounded } from "../../assets/dummyData";
import { getAllSortingFilters } from "../../service/author";
import Pagination from "../utils/pagination";
import { isParamSet } from "../book/ListBooks";

const AuthorList = () => {
  const dispatch = useDispatch();
  const { authors, pagination, loading, error } = useSelector(
    (state) => state.authors,
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

  const navigate = useNavigate();
  const location = useLocation();

  const getQueryParam = (param) => {
    const params = new URLSearchParams(location.search);
    return params.get(param);
  };

  useEffect(() => {
    const name = getQueryParam("name");
    const page = getQueryParam("page");
    const size = getQueryParam("size");
    const sort = getQueryParam("sort");
    const asc = getQueryParam("asc");

    sort ? setSort(sort) : setSort("name");
    asc ? setAsc(asc) : setAsc("true");

    dispatch(fetchAuthors({ name, page, size, sort, asc }));
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
          List of Authors{" "}
          {getQueryParam("name") && `( ${getQueryParam("name")} )`}
        </h1>
        <hr className="border-t-4 border-orange-600 w-1/4 mx-auto" />
      </div>
      {authors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
          <div className="max-w-md">
            <img
              src={NoBookFounded}
              alt="No books found"
              className="w-full h-auto mx-auto mb-8 opacity-90 rounded-2xl"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No authors found
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
        {authors.map((author) => (
          <div
            onClick={() => navigate(`/authors/${author.authorId}`)}
            key={author.authorId}
            className="flex flex-col justify-evenly items-center bg-white rounded-lg shadow-lg w-72 h-72 overflow-hidden hover:bg-gray-100 transition duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl border-2 border-orange-500"
          >
            {/* Author Image (round and prominent) */}
            <img
              src={author.authorImg}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAuthorImg;
              }}
              alt={author.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-orange-500"
            />
            {/* Author Name and Date of Birth */}
            <div className="flex flex-col items-center mt-4 px-4">
              <h2 className="text-xl font-semibold text-orange-700">
                {author.name}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Born:{" "}
                {`${new Date(author.dob)
                  .getDate()
                  .toString()
                  .padStart(2, "0")} ${new Date(author.dob).toLocaleString(
                  "en-GB",
                  { month: "long" },
                )}, ${new Date(author.dob).getFullYear()}`}
              </p>
            </div>
          </div>
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

export default AuthorList;

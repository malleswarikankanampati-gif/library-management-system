import React, { useEffect, useRef, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import SelectAuthor from "./SelectAuthor";
import SelectGenres from "./SelectGenres";
import { MdError } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { getOneAuthor } from "../../service/author";
import { getOneCategories } from "../../service/category";

const Drawer = () => {
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(null);
  const [authorBoxOpen, setAuthorBoxOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryBoxOpen, setCategoryBoxOpen] = useState(false);
  const [publisher, setPublisher] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [tillDate, setTillDate] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [dateErr, setDateErr] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorInput, setAuthorInput] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const getQueryParam = (param) => {
    const params = new URLSearchParams(location.search);
    return params.get(param);
  };

  useEffect(() => {
    setTitle(getQueryParam("title") || "");
    const authorIdUrl = getQueryParam("authorId");
    const categoriesIdsUrl = getQueryParam("categoriesIds");
    setPublisher(getQueryParam("publisher") || "");
    setFromDate(getQueryParam("fromDate") || "");
    setTillDate(getQueryParam("tillDate") || "");
    getQueryParam("availableCopies") == 1
      ? setIsAvailable(true)
      : setIsAvailable(false);

    authorIdUrl && getAuthor(authorIdUrl);
    categoriesIdsUrl && getGenres(categoriesIdsUrl);
  }, []);

  const getGenres = async (ids) => {
    setLoading(true);
    try {
      let cats = [];
      ids.split(",").forEach(async (id) => {
        const res = await getOneCategories(id);
        cats.push({ id: res.data.categoryId, name: res.data.name });
      });
      setCategories(cats);
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

  const getAuthor = async (authorIdUrl) => {
    try {
      const res = await getOneAuthor(authorIdUrl);
      setAuthor({ authorId: res.data.authorId, name: res.data.name });
      setAuthorInput(res.data.name);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClear = () => {
    setTitle("");
    setAuthor(null);
    setAuthorInput("");
    setCategories([]);
    setPublisher("");
    setFromDate("");
    setTillDate("");
    setIsAvailable(false);
  };

  const handleSubmit = () => {
    if (fromDate && tillDate && fromDate > tillDate) {
      setDateErr(
        <div className="mt-2 text-green-600 flex gap-2">
          <span className="flex items-center justify-center">
            <MdError />
          </span>
          Enter a valid date range
        </div>
      );
      return;
    }
    setDateErr(null);

    if (location.pathname.includes("/books")) {
      const params = new URLSearchParams(location.search);

      title ? params.set("title", title) : params.delete("title");

      author
        ? params.set("authorId", author.authorId)
        : params.delete("authorId");

      categories && categories.length > 0
        ? params.set("categoriesIds", categories.map((cat) => cat.id).join(","))
        : params.delete("categoriesIds");

      publisher
        ? params.set("publisher", publisher)
        : params.delete("publisher");

      fromDate ? params.set("fromDate", fromDate) : params.delete("fromDate");

      tillDate ? params.set("tillDate", tillDate) : params.delete("tillDate");

      isAvailable
        ? params.set("availableCopies", 1)
        : params.delete("availableCopies");

      params.delete("page");
      params.delete("size");
      params.delete("sort");
      params.delete("asc");

      navigate(`/books?${params.toString()}`);
    } else {
      navigate(`/books`);
    }
  };

  if (err) {
    return (
      <div className="text-center mt-8 text-red-600 absolute top-28 w-full">
        Error: {err}
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 z-10 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "#00000080" }}
        onClick={toggleDrawer}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 bg-red-950 text-orange-100 border-orange-500 w-64 transform transition-transform duration-300 pt-14 z-20 border-r  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-orange-500">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={toggleDrawer} className="text-2xl cursor-pointer">
            &times;
          </button>
        </div>
        {loading && <>loading...</>}
        <ul className="space-y-4 p-4 min-h-[75vh]">
          <li>
            <label className="block text-lg font-semibold">Title</label>
            <input
              type="text"
              placeholder="Enter Title?"
              className="w-full h-full p-2 rounded-md border border-orange-500 outline-none text-sm placeholder:italic bg-red-900 mt-2"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </li>

          <li>
            <label className="block text-lg font-semibold">Author</label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Select Author?"
              className="w-full p-2 mt-2 border border-orange-500 outline-none rounded-md capitalize select-none text-sm bg-red-900 placeholder:italic"
              onChange={(e) => setAuthorInput(e.target.value)}
              value={authorInput}
              onClick={() => setAuthorBoxOpen(!authorBoxOpen)}
            />
            {authorBoxOpen && (
              <SelectAuthor
                setAuthorBoxOpen={setAuthorBoxOpen}
                selectedAuthor={author}
                setAuthor={setAuthor}
                authorInput={authorInput}
                setAuthorInput={setAuthorInput}
                inputRef={inputRef}
              />
            )}
          </li>

          <li>
            <label className="block text-lg font-semibold">Genres</label>
            <div
              className={`w-full p-2 mt-2 border border-orange-500 outline-none rounded-md cursor-pointer capitalize select-none text-sm bg-red-900`}
              onClick={(e) => {
                setCategoryBoxOpen((c) => !c);
                e.stopPropagation();
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {categories.length === 0 ? (
                <div className="italic opacity-50">Select Genres?</div>
              ) : (
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {categories.map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-sm font-medium border border-orange-500 capitalize"
                    >
                      {cat.name.toLowerCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {categoryBoxOpen && (
              <SelectGenres
                setCategoryBoxOpen={setCategoryBoxOpen}
                selectedCategories={categories}
                setCategories={setCategories}
              />
            )}
          </li>

          <li>
            <label className="block text-lg font-semibold">Publisher</label>
            <input
              type="text"
              placeholder="Enter Publisher?"
              className="w-full h-full p-2 rounded-md border border-orange-500 outline-none text-sm placeholder:italic bg-red-900 mt-2"
              onChange={(e) => setPublisher(e.target.value)}
              value={publisher}
            />
          </li>
          <li>
            <label className="block text-lg font-semibold">
              Publication Year
            </label>
            <div className="flex justify-between items-center gap-2 w-full overflow-hidden mt-2">
              <input
                type="number"
                className="h-full w-24 p-2 rounded-md border border-orange-500 outline-none text-sm placeholder:italic bg-red-900"
                placeholder="From"
                onChange={(e) => setFromDate(e.target.value)}
                value={fromDate}
              />
              <input
                type="number"
                className="h-full w-24 p-2 rounded-md border border-orange-500 outline-none text-sm placeholder:italic bg-red-900"
                placeholder="Till"
                onChange={(e) => setTillDate(e.target.value)}
                value={tillDate}
              />
            </div>
            {dateErr}
          </li>
          <li className="flex items-center gap-4">
            <input
              type="checkbox"
              name="available"
              checked={isAvailable}
              onChange={() => setIsAvailable((s) => !s)}
            />
            <label htmlFor="available">Is Available</label>
          </li>
        </ul>
        <div className="w-full flex justify-evenly items-center">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow transition-all duration-150 ease-in-out cursor-pointer"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow transition-all duration-150 ease-in-out cursor-pointer"
            onClick={handleClear}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Button to toggle the drawer */}
      <button
        onClick={toggleDrawer}
        className={`fixed top-1/2 text-orange-100 bg-red-900 p-4 pl-2 rounded-r-4xl z-30 h-16 transform transition-all duration-300 border border-l-0 flex items-center justify-center border-orange-500 
          ${
            isOpen
              ? "left-64 opacity-0 pointer-events-none"
              : "left-0 cursor-pointer"
          }`}
      >
        <FaAnglesRight />
      </button>
    </div>
  );
};

export default Drawer;

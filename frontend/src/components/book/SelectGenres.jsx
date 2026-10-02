import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { listAllCatogiriesLikeName } from "../../service/category";

const SelectGenres = ({
  setCategoryBoxOpen,
  selectedCategories,
  setCategories,
}) => {
  const categoryBoxRef = useRef(null);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    getLikeName();
  }, [debouncedSearch]);

  const getLikeName = async () => {
    setLoading(true);
    try {
      const res = await listAllCatogiriesLikeName(debouncedSearch);
      setFilteredCategories(res.data);
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

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryBoxRef.current &&
        !categoryBoxRef.current.contains(event.target)
      ) {
        setCategoryBoxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (id, name) => {
    if (selectedCategories.some((item) => item.id === id)) {
      setCategories(selectedCategories.filter((item) => item.id !== id));
    } else {
      setCategories([...selectedCategories, { id, name }]);
    }
  };

  return (
    <div ref={categoryBoxRef}>
      <ul className="absolute bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900 z-10">
        {loading && <div>Loading...</div>}
        {!loading && err && <div>Error: {err}</div>}
        {!loading && !err && (
          <>
            <div
              className="max-h-80 overflow-y-scroll"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="sticky top-0 bg-amber-50 px-2 pt-2 pb-1 z-10 rounded-lg">
                <input
                  type="text"
                  placeholder="Search genres..."
                  className="w-full px-2 py-1 border border-orange-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm text-orange-900 placeholder-orange-700 bg-amber-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              {filteredCategories.map((genre, index) => (
                <li
                  key={index}
                  className={`rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize flex justify-start gap-6`}
                  onClick={() => handleClick(genre.categoryId, genre.name)}
                  title={genre.description}
                >
                  <div className="flex items-center justify-center">
                    {selectedCategories.some(
                      (item) => item.id === genre.categoryId
                    ) ? (
                      <ImCheckboxChecked />
                    ) : (
                      <ImCheckboxUnchecked />
                    )}
                  </div>
                  <div>{genre.name.toLowerCase()}</div>
                </li>
              ))}
            </div>
            {(!filteredCategories || filteredCategories.length === 0) && (
              <div className="px-4 py-3 text-center text-sm text-gray-500 italic">
                {searchTerm
                  ? `No genres found matching "${searchTerm}"`
                  : "No genres available"}
              </div>
            )}
            <hr />
            <li
              className="rounded-lg px-4 py-2 hover:bg-amber-100 hover:underline underline-offset-2 cursor-pointer capitalize flex justify-center gap-6 text-sm items-center"
              onClick={() => window.open("/add-genre", "_blank")}
            >
              Add New Genre
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SelectGenres;

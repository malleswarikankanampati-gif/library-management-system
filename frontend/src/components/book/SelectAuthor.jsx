import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { defaultAuthorImg } from "../../assets/dummyData";
import { listAllAuthors } from "../../service/author";

const SelectAuthor = ({
  setAuthorBoxOpen,
  selectedAuthor,
  setAuthor,
  authorInput,
  setAuthorInput,
  inputRef,
}) => {
  const [debouncedAuthorIp, setDebouncedAuthorIp] = useState(authorInput);
  const [filteredAuthours, setFilteredAuthours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    getLikeName();
  }, [debouncedAuthorIp]);

  const getLikeName = async () => {
    setLoading(true);
    try {
      const res = await listAllAuthors(debouncedAuthorIp);
      setFilteredAuthours(res.data.content);
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
      setDebouncedAuthorIp(authorInput);
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [authorInput]);

  const authorBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        authorBoxRef.current &&
        inputRef.current &&
        !authorBoxRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setAuthorBoxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (id, name) => {
    setAuthor({ authorId: id, name: name });
    setAuthorInput(name);
  };

  return (
    <div ref={authorBoxRef} onClick={() => setAuthorBoxOpen(false)}>
      <ul className="absolute bg-amber-50 shadow-lg border rounded-lg text-orange-950 border-orange-900 z-10">
        {/* Loading State */}
        {loading && <div className="px-4 py-2">Loading...</div>}

        {/* Error State */}
        {!loading && err && (
          <div className="px-4 py-2 text-red-600">Error: {err}</div>
        )}

        {/* Success State (Authors potentially found or not found) */}
        {!loading && !err && (
          <>
            <div
              className="max-h-80 max-w-[500px] overflow-y-scroll"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Check if filteredAuthours exists and has items */}
              {filteredAuthours && filteredAuthours.length > 0 ? (
                filteredAuthours.map((author, index) => (
                  <li
                    key={index}
                    className={`rounded-lg px-4 py-2 hover:bg-amber-100 cursor-pointer capitalize flex justify-start gap-4`}
                    onClick={() => handleClick(author.authorId, author.name)}
                    title={author.biography}
                  >
                    <div className="flex items-center justify-center">
                      {selectedAuthor &&
                      author.authorId === selectedAuthor.authorId ? (
                        <FaCheckCircle />
                      ) : (
                        <FaRegCircle />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Author image */}
                      <div className="bg-black w-12 h-12 rounded-lg flex-shrink-0">
                        {" "}
                        {/* Added flex-shrink-0 */}
                        <img
                          src={author.authorImg}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAuthorImg;
                          }}
                          alt={author.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <div className="font-medium truncate">
                          {author.name.toLowerCase()}
                        </div>
                        <div className="text-sm max-w-[350px] text-gray-600 truncate">
                          {author.biography}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                /* No Authors Found */
                <div className="px-4 py-2 text-gray-500 italic">
                  No authors found.
                </div>
              )}
            </div>
            <hr />
            <li
              className="rounded-lg px-4 py-2 hover:bg-amber-100 hover:underline underline-offset-2 cursor-pointer capitalize flex justify-center gap-6 text-sm items-center"
              onClick={(e) => {
                e.stopPropagation();
                window.open("/add-author", "_blank");
                setAuthorBoxOpen(false);
              }}
            >
              Add New Author
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SelectAuthor;

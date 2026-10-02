import React, { useEffect, useRef, useState } from "react";
import SelectGenres from "./SelectGenres";
import SelectAuthor from "./SelectAuthor";
import { MdError } from "react-icons/md";
import { addNewBook, getOneBook, updateBook } from "../../service/book";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";

const AddBook = () => {
  const maxSummaryLength = 2000;

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [availableCopies, setAvailableCopies] = useState("");
  const [author, setAuthor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authorInput, setAuthorInput] = useState("");

  const [categoryBoxOpen, setCategoryBoxOpen] = useState(false);
  const [authorBoxOpen, setAuthorBoxOpen] = useState(false);

  const [errors, setErrors] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setTitle("");
      setSummary("");
      setPublisher("");
      setPublicationYear("");
      setTotalCopies("");
      setAvailableCopies("");
      setAuthor(null);
      setCategories([]);
      setAuthorInput("");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    if (id) getOne();
  }, [id]);

  const getOne = async () => {
    setLoading(true);
    try {
      const res = await getOneBook(id);
      setTitle(res.data.title);
      setSummary(res.data.summary);
      setPublisher(res.data.publisher);
      setPublicationYear(res.data.publicationYear);
      setTotalCopies(res.data.totalCopies);
      setAvailableCopies(res.data.availableCopies);
      setAuthor({ authorId: res.data.authorId, name: res.data.authorName });
      setAuthorInput(res.data.authorName);
      setCategories(
        res.data.categoryDtos.map((dto) => ({
          id: dto.categoryId,
          name: dto.name,
        }))
      );
      setPreviewUrl(res.data.bookCoverImg || "");
    } catch (err) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while fetching book."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid = () => {
    let valid = true;
    let errorMessages = {};

    if (!id && !selectedFile) {
      errorMessages.image = "Please select an image";
      valid = false;
    }

    if (categories.length === 0) {
      errorMessages.categories = "At least one genre must be selected";
      valid = false;
    }

    if (!author) {
      errorMessages.author = "Author must be selected";
      valid = false;
    }

    if (availableCopies < 0 || availableCopies > totalCopies) {
      errorMessages.availableCopies =
        "Available copies must be >= 0 and less than or equal to total copies";
      valid = false;
    }

    if (totalCopies <= 0) {
      errorMessages.totalCopies =
        "Total copies cannot be less than or equal to 0";
      valid = false;
    }

    if (title.trim() === "") {
      errorMessages.title = "Book title cannot be empty";
      valid = false;
    }

    if (summary.trim() === "") {
      errorMessages.summary = "Book summary cannot be empty";
      valid = false;
    }

    if (publisher.trim() === "") {
      errorMessages.publisher = "Book publisher cannot be empty";
      valid = false;
    }

    if (publicationYear > new Date().getFullYear()) {
      errorMessages.publicationYear =
        "Publication year cannot be greater than the current year";
      valid = false;
    }

    if (!publicationYear || publicationYear < 0) {
      errorMessages.publicationYear = "Publication year cannot be less than 0";
      valid = false;
    }

    if (!valid) {
      setErrors(errorMessages);
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid()) {
      const formData = new FormData();
      const bookDataObj = {
        title: title.trim(),
        summary: summary.trim(),
        publisher: publisher.trim(),
        publicationYear,
        totalCopies,
        availableCopies,
        authorId: author.authorId,
        categoryIds: categories.map((cat) => cat.id),
      };

      const bookDtoBlob = new Blob([JSON.stringify(bookDataObj)], {
        type: "application/json",
      });
      formData.append("bookDto", bookDtoBlob);
      formData.append("bookImg", selectedFile);

      // for (let [key, value] of formData.entries()) {
      //   if (value instanceof Blob && value.type === "application/json") {
      //     value.text().then((text) => {
      //       console.log(`${key}:`, JSON.parse(text));
      //     });
      //   } else {
      //     console.log(`${key}:`, value);
      //   }
      // }

      addOne(formData);
    }
  };

  const addOne = async (book) => {
    setErrors(null);
    setLoading(true);
    try {
      const res = id ? await updateBook(id, book) : await addNewBook(book);
      id
        ? navigate(`/books/${id}`)
        : res?.data?.bookId
        ? navigate(`/books/${res.data.bookId}`)
        : navigate(`/books`);
    } catch (err) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while adding / updating book."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- File Handling Logic ---

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Maximum size is 5 MB.");
        clearSelection();
        return;
      }

      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setError("");
    } else {
      setError("Please select or drop a valid image file (PNG, JPG, GIF).");
      clearSelection();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (selectedFile && !file) {
      return;
    }
    processFile(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleClearClick = (e) => {
    e.stopPropagation();
    clearSelection();
    setError("");
  };

  // --- Drag and Drop Event Handlers ---

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      processFile(file);
      event.dataTransfer.clearData();
    }
  };

  // --- Cleanup Effect ---

  useEffect(() => {
    const currentPreviewUrl = previewUrl;

    return () => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [previewUrl]);

  if (loading) {
    return (
      <div className="text-center mt-8 text-gray-400 absolute top-28 w-full">
        Loading...
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center mt-8 text-red-600 absolute top-28 w-full">
        Error: {err}
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="text-center mt-2 mb-16">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
          {id ? "Edit" : "Add New"} Book
        </h1>
        <hr className="border-t-4 border-orange-600 w-1/5 mx-auto" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-orange-200 p-6 rounded-lg border-2 border-orange-500 shadow-lg space-y-6 text-orange-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28">
          {/* Title */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-semibold">
                Book Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md
                  ${
                    errors && errors.title
                      ? "border-green-700"
                      : "border-orange-600"
                  }`}
                placeholder="Enter book title"
              />
              {errors && errors.title && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.title}
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-lg font-semibold">
                Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= maxSummaryLength) {
                    setSummary(value);
                  }
                }}
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md
                  ${
                    errors && errors.summary
                      ? "border-green-700"
                      : "border-orange-600"
                  }`}
                placeholder="Enter summary"
                rows="5"
                maxLength="2000"
              ></textarea>
              <p className="text-sm">
                {summary.length} / {maxSummaryLength} characters
              </p>
              {errors && errors.summary && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.summary}
                </div>
              )}
            </div>

            {/* Publisher */}
            <div>
              <label
                htmlFor="publisher"
                className="block text-lg font-semibold"
              >
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md
                  ${
                    errors && errors.publisher
                      ? "border-green-700"
                      : "border-orange-600"
                  }`}
                placeholder="Enter publisher"
              />
              {errors && errors.publisher && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.publisher}
                </div>
              )}
            </div>

            {/* Publication Year */}
            <div className="mb-2 md:mb-0">
              <label
                htmlFor="publicationYear"
                className="block text-lg font-semibold"
              >
                Publication Year
              </label>
              <input
                type="number"
                id="publicationYear"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md
                  ${
                    errors && errors.publicationYear
                      ? "border-green-700"
                      : "border-orange-600"
                  }`}
                placeholder="Enter publication year"
              />
              {errors && errors.publicationYear && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.publicationYear}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Total Copies */}
            <div>
              <label
                htmlFor="totalCopies"
                className="block text-lg font-semibold"
              >
                Total Copies
              </label>
              <input
                type="number"
                id="totalCopies"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md
                  ${
                    errors && errors.totalCopies
                      ? "border-green-700"
                      : "border-orange-600"
                  }`}
                placeholder="Enter total copies"
              />
              {errors && errors.totalCopies && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.totalCopies}
                </div>
              )}
            </div>

            {/* Available Copies */}
            <div>
              <label
                htmlFor="availableCopies"
                className="block text-lg font-semibold"
              >
                Available Copies
              </label>
              <input
                type="number"
                id="availableCopies"
                value={availableCopies}
                onChange={(e) => setAvailableCopies(e.target.value)}
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md
                  ${
                    errors && errors.availableCopies
                      ? "border-green-700"
                      : "border-orange-600"
                  }`}
                placeholder="Enter available copies"
              />
              {errors && errors.availableCopies && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.availableCopies}
                </div>
              )}
            </div>

            {/* Author ID */}
            <div>
              <label className="block text-lg font-semibold">Author</label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Select Author"
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md cursor-pointer capitalize select-none
                ${
                  errors && errors.author
                    ? "border-green-700"
                    : "border-orange-600"
                }`}
                onChange={(e) => setAuthorInput(e.target.value)}
                value={authorInput}
                onClick={() => setAuthorBoxOpen(!authorBoxOpen)}
              />
              {errors && errors.author && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.author}
                </div>
              )}
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
            </div>

            {/* Category IDs */}
            <div>
              <label className="block text-lg font-semibold">Genres</label>
              <div
                className={`w-full p-3 mt-2 border-2 outline-none rounded-md cursor-pointer capitalize select-none
                                ${
                                  errors && errors.categories
                                    ? "border-green-700"
                                    : "border-orange-600"
                                }`}
                onClick={(e) => {
                  setCategoryBoxOpen((c) => !c);
                  e.stopPropagation();
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {categories.length === 0 ? (
                  <div className="opacity-50">Select Genres</div>
                ) : (
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {categories.map((cat, index) => (
                      <span
                        key={index}
                        className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium border-2 border-orange-500 capitalize"
                      >
                        {cat.name.toLowerCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {errors && errors.categories && (
                <div className="mt-2 text-green-600 flex gap-2">
                  <span className="flex items-center justify-center">
                    <MdError />
                  </span>
                  {errors.categories}
                </div>
              )}
              {categoryBoxOpen && (
                <SelectGenres
                  setCategoryBoxOpen={setCategoryBoxOpen}
                  selectedCategories={categories}
                  setCategories={setCategories}
                />
              )}
            </div>
          </div>
        </div>

        {/* Book Image */}
        <div className="p-8 max-w-md mx-auto font-sans">
          <label
            htmlFor="authorImgInputTrigger"
            className="block text-lg font-semibold mb-2 text-gray-700"
          >
            Book Cover Image
          </label>

          <input
            type="file"
            id="authorImgInput"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />

          <div
            id="authorImgInputTrigger"
            className={`
          w-full p-6 mt-2 border-2 border-dashed rounded-lg
          flex flex-col items-center justify-center text-center
          cursor-pointer transition-colors duration-200 ease-in-out
          ${previewUrl ? "border-solid" : ""}
          ${
            isDragging
              ? "border-orange-600 bg-orange-100"
              : previewUrl
              ? "hover:bg-orange-100"
              : "hover:border-orange-600 hover:bg-orange-100"
          }
          ${error ? "border-red-500 bg-red-50" : ""}
          ${errors && errors.image ? "border-green-700" : "border-orange-400"}
        `}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Image upload drop zone"
            aria-describedby={error ? "upload-error" : undefined}
          >
            {previewUrl ? (
              <div className="relative group flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Author preview"
                  className="max-h-40 w-auto rounded-md object-contain mb-4 shadow-md"
                  onError={() => {
                    setError("Could not load image preview.");
                    clearSelection();
                  }}
                />
                <button
                  onClick={handleClearClick}
                  className="absolute top-1 right-1 cursor-pointer bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 pointer-events-auto"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
                {selectedFile?.name && (
                  <p className="text-sm text-gray-600">
                    Selected:{" "}
                    <span className="font-medium">{selectedFile?.name}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Click area or drag & drop to replace
                </p>
              </div>
            ) : (
              <div
                className={`flex flex-col items-center transition-opacity duration-200 ${
                  isDragging ? "opacity-70" : "opacity-100"
                }`}
              >
                <UploadCloud
                  size={40}
                  className={`mb-3 ${
                    isDragging ? "text-orange-600" : "text-orange-500"
                  } ${error ? "text-red-500" : ""}`}
                />
                <p
                  className={`font-semibold ${
                    isDragging
                      ? "text-orange-700"
                      : error
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {isDragging
                    ? "Drop image here"
                    : error
                    ? "Upload Error"
                    : "Click to upload or drag & drop"}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    isDragging
                      ? "text-orange-600"
                      : error
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {error ? error : "PNG, JPG, GIF up to 10MB"}
                </p>
                {error && (
                  <span id="upload-error" className="sr-only">
                    {error}
                  </span>
                )}
              </div>
            )}
          </div>
          {errors && errors.image && (
            <div className="mt-2 text-green-600 flex gap-2">
              <span className="flex items-center justify-center">
                <MdError />
              </span>
              {errors.image}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-10 mt-10">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-all duration-300 cursor-pointer"
          >
            {id ? "Update" : "Add"} Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;

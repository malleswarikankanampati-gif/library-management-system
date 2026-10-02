import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

import {
  addNewAuthor,
  getOneAuthor,
  updateOneAuthor,
} from "../../service/author";
import { useNavigate, useParams } from "react-router-dom";

const AddAuthor = () => {
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [dob, setDob] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setName("");
      setBiography("");
      setDob("");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    if (id) getOne();
  }, [id]);

  const getOne = async () => {
    setLoading(true);
    try {
      const res = await getOneAuthor(id);
      setName(res.data.name || "");
      setBiography(res.data.biography || "");
      setDob(res.data.dob || "");
      setPreviewUrl(res.data.authorImg || "");
    } catch (err) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while fetching author."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Author name cannot be empty");
      return;
    }
    if (!id && !selectedFile) {
      alert("Select an author image");
      return;
    }

    const formData = new FormData();

    const authorDataObject = {
      name: name.trim(),
      biography: biography.trim(),
      dob: dob || null,
    };

    const authorDtoBlob = new Blob([JSON.stringify(authorDataObject)], {
      type: "application/json",
    });

    formData.append("authorDto", authorDtoBlob);
    formData.append("authorImg", selectedFile);

    addOne(formData);
  };

  const addOne = async (author) => {
    // console.log("FormData contents:");
    // for (let [key, value] of author.entries()) {
    //   console.log(key, value);
    //   if (value instanceof Blob) {
    //     console.log(`  Blob type: ${value.type}, size: ${value.size}`);
    //   }
    // }

    setLoading(true);
    try {
      const res = id
        ? await updateOneAuthor(id, author)
        : await addNewAuthor(author);
      id
        ? navigate(`/authors/${id}`)
        : res?.data?.authorId
        ? navigate(`/authors/${res.data.authorId}`)
        : navigate(`/authors`);
    } catch (err) {
      console.log(err);
      setErr(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while adding / updating author."
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
    <div className="p-4">
      <div className="text-center mt-2 mb-16">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
          {id ? "Edit" : "Add New"} Author
        </h1>
        <hr className="border-t-4 border-orange-600 w-1/5 mx-auto" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-orange-200 p-6 rounded-lg border-2 border-orange-500 shadow-lg space-y-6 text-orange-800"
        // encType="multipart/form-data"
      >
        {/* Author Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-semibold">
            Author Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mt-2 border-2 outline-none border-orange-600 rounded-md"
            placeholder="Enter author name"
            required
          />
        </div>

        {/* Biography */}
        <div>
          <label htmlFor="biography" className="block text-lg font-semibold">
            Biography
          </label>
          <textarea
            id="biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full p-3 mt-2 border-2 outline-none border-orange-600 rounded-md"
            placeholder="Enter biography"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-lg font-semibold">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            value={dob ? dob.split("T")[0] : ""}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 mt-2 border-2 outline-none border-orange-600 rounded-md"
            required
          />
        </div>

        {/* Author Image URL */}
        <div className="p-8 max-w-md mx-auto font-sans">
          <label
            htmlFor="authorImgInputTrigger"
            className="block text-lg font-semibold mb-2 text-gray-700"
          >
            Author Image
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
          cursor-pointer transition-colors duration-200 ease-in-out border-orange-400
          ${previewUrl ? "border-solid" : ""}
          ${
            isDragging
              ? "border-orange-600 bg-orange-100"
              : previewUrl
              ? "hover:bg-orange-100"
              : "hover:border-orange-600 hover:bg-orange-100"
          }
          ${error ? "border-red-500 bg-red-50" : ""}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-10">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-all duration-300 cursor-pointer"
          >
            {id ? "Update" : "Add"} Author
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAuthor;

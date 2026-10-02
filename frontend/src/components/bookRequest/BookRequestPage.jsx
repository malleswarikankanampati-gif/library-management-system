import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addNewBookRequest,
  getOneBookRequestById,
  updateOneBookRequestById,
} from "../../service/bookRequest";
import ListMemberBookRequests from "./ListMemberBookRequests";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { isCurrentUserLibrarian } from "../../app/features/auth/authSlice";

const BookRequestPage = () => {
  const { member, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: member.firstName + " " + member.lastName || "Name not set",
    email: member.email || "Email not set",
    bookTitle: "",
    author: "",
    requestMessage: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading2, setLoading] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      ...formData,
      bookTitle: "",
      author: "",
      requestMessage: "",
    });
    if (id) {
      getOneBookRequest();
    }
  }, [id]);

  useEffect(() => {
    let timer;

    if (successMsg) {
      timer = setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [successMsg]);

  const getOneBookRequest = async () => {
    setLoading(true);
    try {
      const res = await getOneBookRequestById(id);
      setFormData({
        ...formData,
        bookTitle: res.data.bookTitle,
        author: res.data.author,
        requestMessage: res.data.requestMessage,
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while fetching book request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.bookTitle.trim() == "" || formData.author.trim() == "") {
      setErrorMessage("Title or Author name cannot be empty");
    } else {
      const trimmedFormData = {
        bookTitle: formData.bookTitle.trim(),
        author: formData.author.trim(),
        requestMessage: formData.requestMessage.trim(),
        memberId: member.memberId,
      };
      console.log("Book Request Data:", trimmedFormData);
      id ? updateBookRequest(trimmedFormData) : addBookRequest(trimmedFormData);
    }
  };

  const updateBookRequest = (data) => {
    setLoading(true);
    updateOneBookRequestById(id, data)
      .then((res) => {
        setErrorMessage("");
        setReloadTrigger((prev) => prev + 1);
        setSuccessMsg("Success! We've updated your book request.");
        navigate("/request-book");
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(
          err?.response?.data?.message ||
            err.message ||
            "An error occurred while updating book request.",
        );
      })
      .finally(() => setLoading(false));
  };

  const addBookRequest = (data) => {
    setLoading(true);
    addNewBookRequest(data)
      .then((res) => {
        setFormData({
          ...formData,
          bookTitle: "",
          author: "",
          requestMessage: "",
        });
        setErrorMessage("");
        setReloadTrigger((prev) => prev + 1);
        setSuccessMsg("Congo! Your book request has been added.");
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(
          err?.response?.data?.message ||
            err.message ||
            "An error occurred while adding book request.",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-wrap items-center justify-evenly gap-8 mb-4 lg:mb-0">
      {id && (
        <button
          onClick={() => navigate("/request-book")}
          className="absolute top-16 left-2 flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-200 cursor-pointer"
        >
          <IoArrowBackCircle className="text-2xl" />
          <span className="text-sm font-medium">Request Book</span>
        </button>
      )}

      <div className="w-full max-w-lg min-h-[800px] border-2 border-orange-500 p-8 rounded-xl shadow-xl bg-orange-50 bg-opacity-10 backdrop-blur-md mt-12">
        <h1 className="text-3xl font-semibold text-center mb-4 text-orange-700">
          Book Request Form
        </h1>
        <p className="text-center mb-6 text-orange-600">
          {id
            ? "Please fill out the form below to update book request."
            : "Please fill out the form below to request a book."}
        </p>

        {(loading || loading2) && (
          <div className="text-center mt-8 text-gray-400 top-28 w-full">
            Loading...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg text-orange-600 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full p-3 rounded-md bg-orange-100 text-orange-700 placeholder-orange-400 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg text-orange-600 mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="w-full p-3 rounded-md bg-orange-100 text-orange-700 placeholder-orange-400 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled
            />
          </div>

          {/* Book Title */}
          <div>
            <label
              htmlFor="bookTitle"
              className="block text-lg text-orange-600  mb-2"
            >
              Book Title
            </label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              placeholder="Enter the book title"
              required
              className="w-full p-3 rounded-md bg-orange-100 text-orange-700 placeholder-orange-400 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Author */}
          <div>
            <label
              htmlFor="author"
              className="block text-lg text-orange-600 mb-2"
            >
              Book Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter the book's author"
              required
              className="w-full p-3 rounded-md bg-orange-100 text-orange-700 placeholder-orange-400 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Request Message */}
          <div>
            <label
              htmlFor="requestMessage"
              className="block text-lg text-orange-600 mb-2"
            >
              Additional Request
            </label>
            <textarea
              id="requestMessage"
              name="requestMessage"
              value={formData.requestMessage}
              onChange={handleChange}
              placeholder="Any additional request or details (max 500 characters)"
              maxLength="500"
              rows="3"
              className="w-full p-3 rounded-md bg-orange-100 text-orange-700 placeholder-orange-400 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {errorMessage && (
            <div className="text-red-400 text-sm text-center bg-red-400/20 p-3 rounded-lg border border-red-700 mt-6">
              {errorMessage}
            </div>
          )}

          {successMsg && (
            <div className="text-green-800 text-sm text-center bg-green-100/70 p-3 rounded-lg border border-green-700 mt-6">
              {successMsg}
            </div>
          )}

          <div className="flex justify-around text-center">
            <button
              type="submit"
              className="px-6 py-3 mt-4 text-lg font-semibold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-lg text-white shadow-lg hover:from-orange-600 hover:to-orange-800 transition duration-300 cursor-pointer"
            >
              {id ? "Update Request" : "Submit Request"}
            </button>
            {isCurrentUserLibrarian(member) && (
              <button
                type="button"
                onClick={() => {
                  navigate("/all-book-requests");
                }}
                className="px-6 py-3 mt-4 text-lg font-semibold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-lg text-white shadow-lg hover:from-orange-600 hover:to-orange-800 transition duration-300 cursor-pointer"
              >
                View All Requests
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="w-full max-w-2xl h-[800px] border-2 border-orange-500 p-8 rounded-xl shadow-xl bg-orange-50 bg-opacity-10 backdrop-blur-md mt-12">
        <ListMemberBookRequests reloadTrigger={reloadTrigger} />
      </div>
    </div>
  );
};

export default BookRequestPage;

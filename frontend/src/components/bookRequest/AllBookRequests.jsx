import React, { useEffect, useState } from "react";
import {
  listAllBookReq,
  listAllIncompleteBookReq,
  markBookReqAsComplete,
} from "../../service/bookRequest";
import BookRequestCard from "./BookRequestCard";

const AllBookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    showOnlyIncomplete ? getAllIncomplete() : getAll();
  }, [showOnlyIncomplete]);

  useEffect(() => {
    let timer;
    if (successMsg) {
      timer = setTimeout(() => setSuccessMsg(""), 4000);
    }
    return () => clearTimeout(timer);
  }, [successMsg]);

  const getAll = async () => {
    setLoading(true);
    try {
      const res = await listAllBookReq();
      setRequests(res.data);
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while fetching book requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAllIncomplete = async () => {
    setLoading(true);
    try {
      const res = await listAllIncompleteBookReq();
      setRequests(res.data);
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred while fetching book requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    setLoading(true);
    try {
      await markBookReqAsComplete(id);
      showOnlyIncomplete ? getAllIncomplete() : getAll();
    } catch (err) {
      setErrorMessage("Failed to mark request as completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-6">
      <h1 className="text-3xl font-extrabold text-red-700 text-center">
        All Book Requests
      </h1>
      <hr className="border-t-4 border-red-700 w-40 mx-auto mt-2 mb-6 rounded" />

      {loading && (
        <div className="text-center mt-8 text-gray-500 top-28 w-full">
          Loading...
        </div>
      )}

      {errorMessage && (
        <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-400 mb-4">
          {errorMessage}
        </div>
      )}

      {successMsg && (
        <div className="text-green-800 text-sm text-center bg-green-100/70 p-3 rounded-lg border border-green-400 mb-4">
          {successMsg}
        </div>
      )}

      <button
        className="absolute top-6 left-2 flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-200 cursor-pointer"
        onClick={() => setShowOnlyIncomplete((prev) => !prev)}
      >
        {showOnlyIncomplete ? "Show All" : "Show Incomplete"}
      </button>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {requests.length === 0 ? (
          <p className="text-center text-orange-700/70 col-span-full text-5xl mt-52">
            No pending book requests.
          </p>
        ) : (
          requests.map((req) => (
            <BookRequestCard
              key={req.id}
              req={req}
              handleMarkCompleted={handleMarkCompleted}
              setSuccessMsg={setSuccessMsg}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllBookRequests;

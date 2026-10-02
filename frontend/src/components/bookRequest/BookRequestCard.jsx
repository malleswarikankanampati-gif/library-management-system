import React, { useEffect, useRef, useState } from "react";

const BookRequestCard = ({ req, handleMarkCompleted, setSuccessMsg }) => {
  const [completeButton, setCompleteButton] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setCompleteButton(false);
      }
    }

    if (completeButton) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [completeButton]);

  return (
    <div
      key={req.id}
      className={`bg-orange-100 shadow-md rounded-lg p-5 border border-red-600/70 
        ${req.isCompleted ? "opacity-60" : "border-l-4 border-l-red-600"}
        `}
    >
      <h2 className="text-xl font-extrabold text-red-700 capitalize mb-2">
        {req.bookTitle}
      </h2>
      <p className="text-base text-gray-700 mb-1">
        <strong className="font-bold">Author:</strong>
        <span className="capitalize ml-4">{req.author}</span>
      </p>
      <p className="text-base text-gray-700 mb-2">
        <strong className="font-bold">Message:</strong>
        <span className="ml-4">
          {req.requestMessage || "No additional message..."}
        </span>
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Requested on: {new Date(req.createdAt).toLocaleString()}
      </p>
      {req.isCompleted ? (
        <button
          onClick={() => {
            handleMarkCompleted(req.id);
            setSuccessMsg(
              `Book request for ${
                req.bookTitle.charAt(0).toUpperCase() + req.bookTitle.slice(1)
              } marked as incomplete.`
            );

            setCompleteButton(false);
          }}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 cursor-pointer"
        >
          Mark as Incomplete
        </button>
      ) : (
        <div ref={buttonRef} className="w-fit">
          {!completeButton && (
            <button
              onClick={() => setCompleteButton(true)}
              className="mt-auto bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 cursor-pointer"
            >
              Mark as Complete
            </button>
          )}
          {completeButton && (
            <button
              onClick={() => {
                handleMarkCompleted(req.id);
                setSuccessMsg(
                  `Book request for ${
                    req.bookTitle.charAt(0).toUpperCase() +
                    req.bookTitle.slice(1)
                  } marked as complete.`
                );
              }}
              className="mt-auto bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 cursor-pointer"
            >
              Are you sure?
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookRequestCard;

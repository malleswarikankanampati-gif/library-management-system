import React, { useEffect, useState } from "react";
import {
  deleteBookRequestById,
  listAllBookRequestsByMember,
} from "../../service/bookRequest";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WarningDel from "../utils/WarningDel";

const ListMemberBookRequests = ({ reloadTrigger }) => {
  const { member } = useSelector((state) => state.auth);

  const [bookRequests, setBookRequests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    listBookRequests();
  }, [reloadTrigger]);

  const listBookRequests = () => {
    setLoading(true);
    listAllBookRequestsByMember(member.memberId)
      .then((res) => {
        setBookRequests(res.data);
        setErrorMsg("");
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(
          err?.response?.data?.message ||
            err.message ||
            "An error occurred while fetching book request."
        );
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteBookRequestById(id);
      console.log(res.data);
      listBookRequests();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred while deleting book request."
      );
    }
    setWarning(null);
  };

  return (
    <div className="">
      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 text-center">
          Your Book Requests
        </h2>
        <hr className="border-t-4 border-red-500 w-40 mx-auto mt-2 rounded" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : errorMsg ? (
        <div className="text-center text-red-500">{errorMsg}</div>
      ) : bookRequests.length === 0 ? (
        <div className="text-center text-orange-700/60 col-span-full text-3xl mt-44">
          No book requests found.
        </div>
      ) : (
        <div className="space-y-4 h-[660px] overflow-y-auto no-scrollbar pr-1">
          {bookRequests.map((req) => (
            <div
              key={req.id}
              className={`border border-orange-400 rounded-lg p-4 shadow-md cursor-pointer
                ${
                  req.isCompleted
                    ? "opacity-50"
                    : "hover:shadow-lg transition-shadow duration-200"
                }
                `}
              title={req.isCompleted ? "Completed: Please delete this" : "Edit"}
              onClick={
                req.isCompleted
                  ? () => {
                      setWarning(
                        <WarningDel
                          onDelete={() => handleDelete(req.id)}
                          onCancel={() => setWarning(null)}
                        />
                      );
                    }
                  : () => {
                      navigate("/request-book/" + req.id);
                    }
              }
            >
              {/* Two-column layout */}
              <div className="flex justify-between items-start gap-4">
                {/* Left Section: Title & Author */}
                <div className="w-2/5 capitalize">
                  <div className="text-lg font-bold text-orange-700">
                    {req.bookTitle}
                  </div>
                  <div className="text-sm text-orange-500 mt-1">
                    by {req.author}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-orange-300 mx-2 self-stretch" />

                {/* Right Section: Details */}
                <div className="w-3/5 text-sm">
                  {req.requestMessage ? (
                    <div className="text-orange-700">{req.requestMessage}</div>
                  ) : (
                    <span className="text-orange-700/60">
                      No additional message...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {warning}
    </div>
  );
};

export default ListMemberBookRequests;

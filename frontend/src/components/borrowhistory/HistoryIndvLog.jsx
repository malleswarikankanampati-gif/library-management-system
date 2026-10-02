import React, { useContext } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { hasMemberInPath } from "../utils/UtilFuncs";
import { ScrollContext } from "../utils/context/ScrollContext";

const HistoryIndvLog = ({ hist, onClose = null }) => {
  const navigate = useNavigate();
  const scrollRef = useContext(ScrollContext);

  const handleMemberClick = hasMemberInPath()
    ? () => {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    : () => {
        onClose?.();
        navigate("/member/" + hist.memberId);
      };

  return (
    <li
      key={hist.borrowHistoryId}
      className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-gray-700 text-sm leading-relaxed whitespace-normal break-words"
    >
      Book:{" "}
      <a
        onClick={() => {
          onClose?.();
          navigate("/books/" + hist.bookId);
        }}
        className="font-medium text-orange-700 hover:text-orange-900 hover:underline transition-colors duration-150 cursor-pointer"
      >
        "{hist.title}"
      </a>{" "}
      by{" "}
      <a
        onClick={() => {
          onClose?.();
          navigate("/authors/" + hist.authorId);
        }}
        className="italic text-blue-700 hover:text-blue-900 hover:underline transition-colors duration-150 cursor-pointer"
      >
        {hist.authorName}
      </a>{" "}
      was <span className="font-semibold lowercase">{hist.activityType}ed</span>{" "}
      by{" "}
      <a
        onClick={handleMemberClick}
        className="font-medium text-green-700 hover:text-green-900 hover:underline transition-colors duration-150 cursor-pointer"
      >
        {hist.firstName} {hist.lastName}
      </a>{" "}
      on {format(new Date(hist.createdAt), "dd MMM yyyy, hh:mm a")}
      {hist.borrowedDays != null && hist.activityType === "RETURN" && (
        <>
          {" "}
          after <span className="font-bold">{hist.borrowedDays}</span> days
        </>
      )}
      .
    </li>
  );
};

export default HistoryIndvLog;

import React, { useEffect, useState } from "react";
import { getAllMembers } from "../../service/auth";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { dummyMemberAvatar } from "../../assets/dummyData";
import DrawerMember from "./DrawerMember";

const ListMember = () => {
  const [members, setMembers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    listAllMembers();
  }, [filters]);

  const listAllMembers = () => {
    setLoading(true);
    getAllMembers(filters)
      .then((res) => {
        setMembers(res.data);
        setErrorMsg("");
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(
          err?.response?.data?.message || err.message || "An error occurred.",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <DrawerMember setFilters={setFilters} />

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-orange-600 mb-10 text-center">
          📚 Library Members
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-10">
            <AiOutlineLoading3Quarters className="animate-spin text-orange-600 text-4xl" />
          </div>
        )}

        {/* Error State */}
        {!loading && errorMsg && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            {errorMsg}
          </div>
        )}

        {/* Members Grid */}
        {!loading && !errorMsg && members.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {members.map((member) => (
              <div
                key={member.username}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all border border-orange-200 whitespace-normal break-words"
              >
                {/* Card Header / Avatar */}
                <div className="relative">
                  <img
                    src={member.memberImg || dummyMemberAvatar}
                    alt={`${member.firstName} ${member.lastName}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      if (e.target.src !== dummyMemberAvatar) {
                        e.target.src = dummyMemberAvatar;
                      }
                    }}
                    className="w-full h-48 object-contain rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-800/50 to-transparent rounded-t-xl" />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-orange-900">
                    {member.firstName} {member.lastName}
                  </h2>
                  <p className="text-sm text-orange-700">{member.email}</p>
                  <p className="text-xs mt-2 inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-medium">
                    {member.status}
                  </p>
                </div>

                {/* Card Footer / Actions */}
                <div className="p-4 border-t border-orange-100 flex justify-between items-center">
                  <span className="text-sm text-orange-600">
                    {member.username?.trim() && `@${member.username}`}
                  </span>
                  <button
                    onClick={() => navigate(`/member/${member.memberId}`)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !errorMsg && members.length === 0 && (
          <p className="text-center text-orange-700 mt-20">No members found.</p>
        )}
      </div>
    </div>
  );
};

export default ListMember;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Lock, Home } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUrl } from "../../app/features/auth/authSlice";

const InvalidAccess = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center bg-white shadow-xl rounded-2xl p-10 border border-orange-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-5 rounded-full">
            <AlertTriangle className="text-orange-600 w-10 h-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-orange-700 mb-3">
          Access Restricted
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          The page you are trying to access is unavailable. This may happen
          because:
        </p>

        {/* Reasons */}
        <div className="text-left text-gray-600 space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" />
            <span>You are not logged in</span>
          </div>

          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" />
            <span>You don't have permission to view this page</span>
          </div>

          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" />
            <span>The page does not exist</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            <Home size={18} />
            Go Home
          </Link>

          {!isAuthenticated && (
            <button
              onClick={() => {
                dispatch(setCurrentUrl(location.pathname + location.search));
                navigate("/login");
              }}
              className="border border-orange-500 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvalidAccess;

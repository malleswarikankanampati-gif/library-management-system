import { useSelector } from "react-redux";
import cvImg from "../assets/img/bg1.jpg";
import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";

const Home = () => {
  const { member, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="relative w-full bg-cover bg-center">
      <div className="fixed inset-0 w-screen -z-40 pointer-events-none select-none">
        <img
          src={cvImg}
          className="object-cover fixed top-0 left-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/60"></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-orange-100 px-6 md:px-12"
        style={{
          minHeight: "calc(100vh - 3rem)",
        }}
      >
        <div className="max-w-full pb-8 flex flex-col items-center lg:flex-row lg:items-center lg:justify-center">
          <div className="mb-8 lg:mb-0 lg:mr-24 flex-shrink-0">
            <img
              src={logo}
              alt="BookNest Logo"
              className="w-full max-h-[400px] object-contain rounded-lg shadow-md"
            />
          </div>
          {/* Text Content */}
          {!isAuthenticated && (
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">
                Welcome to the <span className="text-orange-400">Future</span>
                <br />
                of Library Management
              </h1>
              <h3 className="text-lg md:text-xl mb-12 font-light text-gray-300 max-w-2xl mx-auto [text-shadow:1px_1px_2px_rgba(0,0,0,0.6)] lg:mx-0">
                Seamlessly manage books, members, and everything in between. The
                ultimate solution designed for clarity and efficiency in your
                library.
              </h3>
              <div className="flex justify-center lg:justify-start gap-6 md:gap-8 flex-wrap">
                <Link
                  to="/login"
                  className="bg-orange-500 text-white font-semibold py-3 px-8 rounded-full text-lg
                           shadow-md hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2
                           focus:ring-orange-400 focus:ring-opacity-75 transform hover:-translate-y-1
                           transition-all duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-orange-400 text-orange-400 font-semibold py-3 px-8 rounded-full text-lg
                           shadow-sm hover:bg-orange-400 hover:text-white focus:outline-none focus:ring-2
                           focus:ring-orange-300 focus:ring-opacity-75 transform hover:-translate-y-1
                           transition-all duration-300 ease-in-out"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="text-center lg:text-left z-0">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">
                Hello,{" "}
                <span className="text-orange-400 capitalize">
                  {member.firstName || "Valued"} {member.lastName || "Member"}!
                </span>
              </h1>
              <h3 className="text-lg md:text-xl mb-12 font-light text-gray-300 max-w-2xl mx-auto [text-shadow:1px_1px_2px_rgba(0,0,0,0.6)] lg:mx-0">
                Welcome back to your personalized library hub. Get ready to
                explore, manage, and discover with ease.
              </h3>
              <div className="flex justify-center lg:justify-start gap-6 md:gap-8 flex-wrap">
                <Link
                  to="/member"
                  className="bg-orange-500 text-white font-semibold py-3 px-8 rounded-full text-lg
                            shadow-md hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2
                            focus:ring-orange-400 focus:ring-opacity-75 transform hover:-translate-y-1
                            transition-all duration-300 ease-in-out"
                >
                  Go to Profile
                </Link>
                <Link
                  to="/books"
                  className="bg-transparent border-2 border-orange-400 text-orange-400 font-semibold py-3 px-8 rounded-full text-lg
                            shadow-sm hover:bg-orange-400 hover:text-white focus:outline-none focus:ring-2
                            focus:ring-orange-300 focus:ring-opacity-75 transform hover:-translate-y-1
                            transition-all duration-300 ease-in-out"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

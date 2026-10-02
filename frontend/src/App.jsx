import "./App.css";
import AuthorPage from "./components/author/AuthorPage";
import Home from "./components/Home";
import ListAuthors from "./components/author/ListAuthors";
import { Routes, Route, Navigate } from "react-router-dom";
import ListBooks from "./components/book/ListBooks";
import BookPage from "./components/book/BookPage";
import lbImg from "./assets/img/library-bg.jpg";
import AddGenre from "./components/genre/AddGenre";
import AddAuthor from "./components/author/AddAuthor";
import About from "./components/utils/About";
import AddBook from "./components/book/AddBook";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useAutoLogout } from "./components/utils/useAutoLogout";
import AutoLogoutPopup from "./components/utils/AutoLogoutPopup";
import BookRequestPage from "./components/bookRequest/BookRequestPage";
import AllBookRequests from "./components/bookRequest/AllBookRequests";
import Wishlist from "./components/wishlist/Wishlist";
import Borrow from "./components/borrow/Borrow";
import MyProfile from "./components/members/MyProfile";
import OtherProfile from "./components/members/OtherProfile";
import ListMember from "./components/members/ListMember";
import PendingAllBorrow from "./components/borrow/PendingAllBorrow";
import { ScrollContext } from "./components/utils/context/ScrollContext";
import InvalidAccess from "./components/utils/InvalidAccess";
import { isCurrentUserLibrarian } from "./app/features/auth/authSlice";

function App() {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { member, isAuthenticated, loading } = useSelector(
    (state) => state.auth,
  );

  const [displayLogoutPopup, setDisplayLogoutPopup] = useState(false);

  useAutoLogout(isAuthenticated, dispatch, setDisplayLogoutPopup);

  return (
    <div>
      <div className="bg-orange-100 fixed inset-0 w-screen h-screen -z-40 pointer-events-none select-none">
        <img
          src={lbImg}
          className="opacity-30 object-cover fixed top-0 left-0 w-full h-full"
        />
      </div>

      <div className="fixed w-full h-12 bg-gradient-to-r from-orange-500 to-yellow-600 shadow-md flex items-center z-40">
        <Navbar isAuthenticated={isAuthenticated} />
      </div>

      {loading && (
        <div className="text-center mt-8 text-gray-500 absolute top-28 w-full">
          Loading...
        </div>
      )}

      {displayLogoutPopup && (
        <AutoLogoutPopup
          setDisplayLogoutPopup={setDisplayLogoutPopup}
          dispatch={dispatch}
        />
      )}

      <ScrollContext.Provider value={scrollRef}>
        <div
          ref={scrollRef}
          className="fixed top-12 left-0 right-0 bottom-0 overflow-y-auto"
        >
          {!loading && !isAuthenticated && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/invalid-access" element={<InvalidAccess />} />
              <Route path="*" element={<InvalidAccess />} />
            </Routes>
          )}

          {!loading && isAuthenticated && (
            <>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authors" element={<ListAuthors />} />
                <Route path="/authors/:id" element={<AuthorPage />} />
                <Route path="/books" element={<ListBooks />} />
                <Route path="/books/:id" element={<BookPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/request-book" element={<BookRequestPage />} />
                <Route path="/request-book/:id" element={<BookRequestPage />} />
                {isCurrentUserLibrarian(member) && (
                  <>
                    <Route
                      path="/all-book-requests"
                      element={<AllBookRequests />}
                    />
                    <Route
                      path="/pending-borrow"
                      element={<PendingAllBorrow />}
                    />
                    <Route path="/member/:id" element={<OtherProfile />} />
                    <Route path="/add-genre" element={<AddGenre />} />
                    <Route path="/edit-genre/:id" element={<AddGenre />} />
                    <Route path="/add-author" element={<AddAuthor />} />
                    <Route path="/edit-author/:id" element={<AddAuthor />} />
                    <Route path="/add-book" element={<AddBook />} />
                    <Route path="/edit-book/:id" element={<AddBook />} />
                  </>
                )}
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/borrow" element={<Borrow />} />
                <Route path="/member" element={<MyProfile />} />
                <Route path="/all-member" element={<ListMember />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
                <Route path="*" element={<InvalidAccess />} />
              </Routes>
            </>
          )}
        </div>
      </ScrollContext.Provider>
    </div>
  );
}

export default App;

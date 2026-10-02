import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "./bookSlice";

const BooksList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Books List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.bookId}>
            <hr />
            <h3>{book.title}</h3>
            <p>{book.summary}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Year: {book.publicationYear}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksList;

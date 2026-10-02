import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthors } from "./authorSlice";

const AuthorsList = () => {
  const dispatch = useDispatch();
  const { authors, loading, error } = useSelector((state) => state.authors);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Authors</h2>
      <ul>
        {authors.map((author, index) => (
          <li key={index}>{author.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorsList;

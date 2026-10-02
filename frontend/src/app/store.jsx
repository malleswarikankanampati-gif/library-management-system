import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import categoriesReducer from "./features/category/categorySlice";
import authorsReducer from "./features/author/authorSlice";
import booksReducer from "./features/book/bookSlice";
import authReducer from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    categories: categoriesReducer,
    authors: authorsReducer,
    books: booksReducer,
    auth: authReducer,
  },
});

export default store;

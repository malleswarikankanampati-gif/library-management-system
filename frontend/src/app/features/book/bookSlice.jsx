import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listAllBooksFiltered } from "../../../service/book";

const initialState = {
  books: [],
  pagination: {},
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (
    {
      title,
      authorId,
      categoriesIds,
      publisher,
      fromDate,
      tillDate,
      availableCopies,
      page,
      size,
      sort,
      asc,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await listAllBooksFiltered(
        title,
        authorId,
        categoriesIds,
        publisher,
        fromDate,
        tillDate,
        availableCopies,
        page,
        size,
        sort,
        asc
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while fetching books."
      );
    }
  }
);

// export const fetchBooksByGenre = createAsyncThunk(
//   "books/fetchBooksByGenre",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await listAllBooksFiltered(null, null, id);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           error.message ||
//           "An error occurred while fetching books."
//       );
//     }
//   }
// );

// export const fetchBooksLikeTitle = createAsyncThunk(
//   "books/fetchBooksLikeTitle",
//   async (title, { rejectWithValue }) => {
//     try {
//       const response = await listAllBooksFiltered(title);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error?.response?.data?.message ||
//           error.message ||
//           "An error occurred while fetching books."
//       );
//     }
//   }
// );

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.content;
        state.pagination = action.payload.page;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;

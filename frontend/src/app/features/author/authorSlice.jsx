import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listAllAuthors } from "../../../service/author";

const initialState = {
  authors: [],
  pagination: {},
  loading: false,
  error: null,
};

export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async ({ name, page, size, sort, asc }, { rejectWithValue }) => {
    try {
      const response = await listAllAuthors(name, page, size, sort, asc);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while fetching authors."
      );
    }
  }
);

const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.content;
        state.pagination = action.payload.page;
        state.error = null;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authorSlice.reducer;

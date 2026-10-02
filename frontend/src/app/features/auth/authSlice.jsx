import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAuthenticationStatus,
  getMemberDetails,
  logout,
} from "../../../service/auth";

const isAuthenticated = getAuthenticationStatus() || false;

const initialState = {
  member: null,
  isAuthenticated,
  loading: isAuthenticated,
  error: null,
  currentUrl: "/",
};

export const getMemberDetailsLocal = createAsyncThunk(
  "auth/getMemberDetailsLocal",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMemberDetails();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while fetching member details.",
      );
    }
  },
);

export const isCurrentUserLibrarian = (member) =>
  member?.roleNames?.includes("ROLE_LIBRARIAN") ?? false;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUrl: (state, action) => {
      state.currentUrl = action.payload;
    },
    allLogout: (state) => {
      state.member = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      logout();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMemberDetailsLocal.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMemberDetailsLocal.fulfilled, (state, action) => {
        state.loading = false;
        state.member = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getMemberDetailsLocal.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        logout();
      });
  },
});

export const { setCurrentUrl, allLogout } = authSlice.actions;
export default authSlice.reducer;

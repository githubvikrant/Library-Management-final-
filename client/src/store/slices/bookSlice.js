import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "../slices/popUpSlice";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: "null",
    books: [],
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    restockBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    restockBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    restockBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updateBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});


export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  await axios
    .get("/api/v1/book/all", { withCredentials: true })
    .then((res) => {
      dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));

    })
    .catch((err) => {
      dispatch(bookSlice.actions.fetchBooksFailed(err.response.data.message));
    });
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  await axios
    .post("/api/v1/book/admin/add", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(bookSlice.actions.addBookSuccess(res.data.message));
      dispatch(toggleAddBookPopup());
    })
    .catch((err) => {
      dispatch(bookSlice.actions.addBookFailed(err.response.data.message));
    });
};

// Add more copies (quantity) to an existing book — admin only
export const restockBook = (id, quantity) => async (dispatch) => {
  dispatch(bookSlice.actions.restockBookRequest());
  await axios
    .patch(
      `http://localhost:8000/api/v1/book/restock/${id}`,
      { quantity },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    )
    .then((res) => {
      dispatch(bookSlice.actions.restockBookSuccess(res.data.message));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.restockBookFailed(err.response?.data?.message || "Failed to restock"));
    });
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
}

export const updateBook = (id, data) => async (dispatch) => {
  dispatch(bookSlice.actions.updateBookRequest());
  await axios
    .put(
      `http://localhost:8000/api/v1/book/admin/update/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      dispatch(bookSlice.actions.updateBookSuccess(res.data.message));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.updateBookFailed(err.response?.data?.message || "Failed to update book"));
    });
};

export default bookSlice.reducer;

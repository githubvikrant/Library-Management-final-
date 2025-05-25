import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import popupReducer from "./slices/popUpSlice.js";
import userReducer from "./slices/userSlice.js";
import bookReducer from "./slices/bookSlice.js";
import borrowReducer from "./slices/borrowSlice.js";

export const store = configureStore({
    reducer: {
        auth : authReducer,
        popup: popupReducer,
        user: userReducer,
        book : bookReducer,
        borrow: borrowReducer,
    }
});

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    window.__REDUX_DEVTOOLS_EXTENSION__();
}
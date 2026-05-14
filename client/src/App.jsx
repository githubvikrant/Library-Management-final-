import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OTP from "./pages/OTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import {ToastContainer} from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/authSlice.js";
import { fetchAllUsers } from "./store/slices/userSlice.js";
import { fetchAllBooks } from "./store/slices/bookSlice.js";
import { fetchUserBorrowedBooks, fetchAllBorrowedBooks } from "./store/slices/borrowSlice.js";

// Import Components for Nested Routes
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BookManagement from "./components/BookManagement";
import Catalog from "./components/Catalog";
import MyBorrowedBooks from "./components/MyBorrowedBooks";
import Users from "./components/Users";

/**
 * DashboardRedirect Component
 * Determines which dashboard to show on the root ("/") path based on the user's role.
 */
const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
};


const App = () => {
  const {user, isAuthenticated} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // This fetches the user once on app load to maintain session
    dispatch(getUser());
  }, [dispatch]);
  
  useEffect(() => {
    // Only fetch books and role-based data *after* user is confirmed authenticated
    if (isAuthenticated) {
      dispatch(fetchAllBooks());
  
      if (user?.role === "user") {
        dispatch(fetchUserBorrowedBooks());
      }
  
      if (user?.role === "admin") {
        dispatch(fetchAllUsers());
        dispatch(fetchAllBorrowedBooks());
      }
    }
  }, [dispatch, isAuthenticated, user?.role]);

  return (
    <Router>
      <Routes>
        {/* Protected Nested Routes within the Home Layout */}
        <Route path="/" element={<Home/>}>
          <Route index element={<DashboardRedirect />} />
          <Route path="books" element={<BookManagement />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="users" element={<Users />} />
          <Route path="my-borrowed-books" element={<MyBorrowedBooks />} />
        </Route>

        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/verifyOTP/:email" element={<OTP/>}/>
        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;

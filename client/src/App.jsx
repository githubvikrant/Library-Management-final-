import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OTP from "./pages/OTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import {ToastContainer} from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/authSlice.js";
import { fetchAllUsers } from "./store/slices/userSlice.js";
import { fetchAllBooks } from "./store/slices/bookSlice.js";
import { fetchUserBorrowedBooks, fetchAllBorrowedBooks } from "./store/slices/borrowSlice.js";


const App = () => {

  const {user, isAuthenticated} = useSelector((state) => state.auth);
   const dispatch = useDispatch();

   useEffect(() => {
      // This fetches the user once on app load
      dispatch(getUser());
    }, [dispatch]);
    
    useEffect(() => {
      // Only fetch books and role-based data *after* user is confirmed
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
    








  return <Router>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/password/forgot" element={<ForgotPassword/>}/>
    <Route path="/verifyOTP/:email" element={<OTP/>}/>
    <Route path="/password/reset/:token" element={<ResetPassword/>}/>
   </Routes>
   <ToastContainer theme="dark" />
  </Router>;
};

export default App;

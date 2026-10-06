import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, register } from "../store/slices/authSlice.js";
import { useNavigate, Link, Navigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";
/**
 * Register Component
 * Handles new user registration. Upon successful registration, the user
 * is authenticated and logged in directly.
 */
const Register = () => {
  // Local state for user inputs
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const dispatch = useDispatch();

  // Extract authentication state from Redux store
  const {loading , error, message, isAuthenticated} = useSelector((state) => state.auth);

  const navigateTo = useNavigate();
  
  /**
   * Handles the registration form submission.
   */
  const handleRegister = (e)=> {
    e.preventDefault();
    const data = { name, email, password };
    dispatch(register(data)); // Dispatch register thunk
  };

  // useEffect to listen for registration success/error messages
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if(isAuthenticated){
    return <Navigate to={"/"}/>
  }
  return <>
   <div className="flex flex-col justify-center md:flex-row h-screen">
    {/* left side */}
    <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
      <div className="text-center h-[376px]">
        <div className="flex justify-center mb-12">
          <img src={logo_with_title} alt="logo" />
        </div>
        <p className="text-gray-300 mb-12">Already have account? Sign in now</p>
        <Link to={"/login"} className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition duration-300 ease-in-out">
        sign in 
        </Link>
      </div>
    </div>
    {/* right side */}
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
            <h3 className="font-semibold text-3xl overflow-hidden">Sign up</h3>
            <img src={logo} alt="logo" className="h-auto w-16 object-cover"/>
          </div>
        </div>
        <p className="text-gray-600 text-center mb-6 text-sm">Sign up with 1-click Google or enter your details</p>

      {/* Google One-Click Signup */}
      <GoogleAuthButton text="signup_with" />

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-xs uppercase font-medium">Or continue with password</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        {/* Name Input */}
        <div>
          <input type="text" name="name" autoComplete="name" required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-black"/>
        </div>

        {/* Email Input */}
        <div>
          <input type="email" name="email" autoComplete="username" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-black"/>
        </div>

        {/* Password Input */}
        <div>
          <input type="password" name="password" autoComplete="new-password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password (min 6 characters)" className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-black"/>
        </div>
        <button type="submit" disabled={loading} className="border-2 mt-2 border-black w-full font-semibold bg-black text-white py-2.5 rounded-lg hover:bg-white hover:text-black transition duration-200 disabled:opacity-50">
          {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </button>
        <div className="text-center mt-3 md:hidden">
          <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-semibold text-black underline">Sign In</Link></p>
        </div>
      </form>

    </div>
    </div>
   </div>
  </>;
};

export default Register;

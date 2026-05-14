import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, register } from "../store/slices/authSlice.js";
import { useNavigate, Link, Navigate } from "react-router-dom";
/**
 * Register Component
 * Handles new user registration. Upon successful registration, it redirects
 * the user to the OTP verification page.
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
  useEffect(()=> {
    if(message){
      navigateTo(`/verifyOTP/${email}`);
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  },[dispatch, isAuthenticated, error, loading, email, message, navigateTo]);

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
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white  p-8">
    <div className="w-full max-w-sm">
      <div className="flex justify-center mb-12">
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
          <h3 className="font-medium text-4xl overflow-hidden">Sign up</h3>
          <img src={logo} alt="logo" className="h-auto w-24 object-cover"/>
        </div>
      </div>
      <p className="text-gray-800 text-center mb-12">Please provide information to sign up</p>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {/* Name Input */}
        <div className="mb-2">
          <input type="text" name="name" autoComplete="name" required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"/>
        </div>

        {/* Email Input */}
        <div className="mb-2">
          <input type="email" name="email" autoComplete="username" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"/>
        </div>

        {/* Password Input */}
        <div className="mb-2">
          <input type="password" name="password" autoComplete="new-password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"/>
        </div>
        <button type="submit" disabled={loading} className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition disabled:opacity-50">
          {loading ? "SIGNING UP..." : "SIGN UP"}
        </button>
      </form>

    </div>
    </div>
   </div>
  </>;
};

export default Register;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import logo from "../assets/black-logo.png";
import { toast } from "react-toastify";
import { login, resetAuthSlice } from "../store/slices/authSlice.js";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";
/**
 * Login Component
 * Handles user authentication by dispatching the login action to the Redux store.
 */
const Login = () => {
   // Local state for form inputs
   const [email,setEmail] = React.useState("");
   const [password,setPassword] = React.useState("");
   const dispatch = useDispatch();

   // Extract authentication state from Redux store
   const {loading , error ,message , isAuthenticated} = useSelector((state) => state.auth);

   /**
    * Handles form submission.
    * Uses FormData to prepare the payload for the backend API.
    */
   const handleLogin = (e)=> {
    e.preventDefault();
    const data = { email, password };
    dispatch(login(data));
   }
   
    // React useEffect hook to handle side effects (like showing toast notifications)
    // Runs whenever `message` or `error` changes in the Redux state.
    useEffect(() => {
      if(message){
        toast.success(message);
        dispatch(resetAuthSlice()); // Reset state to prevent duplicate toasts
      }
      if (error) {
        toast.error(error);
        dispatch(resetAuthSlice());
      }
    }, [dispatch, error, isAuthenticated, loading, message]);

    if(isAuthenticated) {
      return <Navigate to="/" />;
    }
   

  return <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* left side */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-6">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-20 w-auto" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-center mb-2 overflow-hidden">
             Welcome Back!
            </h1>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Sign in with 1-click Google or enter your credentials
            </p>

            {/* Google One-Click Sign In */}
            <GoogleAuthButton text="signin_with" />

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-xs uppercase font-medium">Or continue with password</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-3"
            >
              {/* Email Input */}
              <input
                type="email"
                name="email"
                autoComplete="username"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
                required
              />
              {/* Password Input */}
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
                required
              />
              <div className="flex justify-between items-center text-xs mt-1">
                <Link to={"/password/forgot"} className="font-medium text-gray-600 hover:text-black">Forgot Password?</Link>
                <Link to={"/register"} className="font-semibold text-black hover:underline">Create account</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out disabled:opacity-50 mt-2">
               {loading ? "Logging in..." : "Login with Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
  </>;
};

export default Login;

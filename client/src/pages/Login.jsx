import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import logo from "../assets/black-logo.png";
import { toast } from "react-toastify";
import { login, resetAuthSlice } from "../store/slices/authSlice.js";
const Login = () => {
   const [email,setEmail] = React.useState("");
   const [password,setPassword] = React.useState("");
   const dispatch = useDispatch();

   const {loading , error ,message , isAuthenticated} = useSelector((state) => state.auth);

   const handleLogin = (e)=> {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
   }
    useEffect(() => {
      if(message){
        toast.success(message);
        dispatch(resetAuthSlice());
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
            <div className="flex justify-center mb-12">
              <div className="rounded-full  flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">
             Welcome Back!
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter your credentials to Login
            </p>
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
              />
              <Link to={"/password/forgot"} className="font-semibold rounded-md text-black ">Forgot Password ?</Link>
              <Link to={"/register"} className="font-semibold rounded-md text-black mb-6">New User ? Create account</Link>
              <button
                type="submit"
                className="bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out">
               Login
              </button>
            </form>
          </div>
        </div>
      </div>
  </>;
};

export default Login;

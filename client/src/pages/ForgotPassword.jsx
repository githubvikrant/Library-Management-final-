import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Navigate, Link } from "react-router-dom";
import logo from "../assets/black-logo.png";
import { toast } from "react-toastify";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice.js";


const ForgotPassword = () => {

   const [email, setEmail] = useState("");

   const dispatch = useDispatch();

   const {loading , error ,message , isAuthenticated} = useSelector((state) => state.auth);
   
    const handleForgotPassword = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
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
          <Link
            to={"/login"}
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4  fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div className="rounded-full  flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">
              Forgot Password ?
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter your email address to receive a verification code.
            </p>
            <form
              onSubmit={handleForgotPassword}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className={`bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              > Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
  </>;
};

export default ForgotPassword;

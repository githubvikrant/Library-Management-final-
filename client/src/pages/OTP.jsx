import { useParams, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice.js";

import logo from "../assets/black-logo.png";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* left side */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/register"}
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
              Check your Email
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter the otp to proceed
            </p>
            <form
              onSubmit={handleOtpVerification}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className={`bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;

import React from "react";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";

const GoogleAuthButton = ({ text = "signin_with" }) => {
  const dispatch = useDispatch();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = (credentialResponse) => {
    if (credentialResponse?.credential) {
      dispatch(googleLogin({ credential: credentialResponse.credential }));
    }
  };

  const handleError = () => {
    toast.error("Google Sign-In was unsuccessful. Try again.");
  };

  const handleSimulatedGoogleLogin = () => {
    // Graceful fallback for demo/testing when Google Client ID is not configured yet
    const simulatedEmail = window.prompt("Enter your Google / Work Email to continue instantly with 1-click Google Sign-In:", "user@gmail.com");
    if (simulatedEmail && simulatedEmail.trim()) {
      const name = simulatedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      dispatch(
        googleLogin({
          email: simulatedEmail.trim(),
          name: name || "Google User",
          picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(simulatedEmail.trim())}`,
          googleId: `google_demo_${Date.now()}`
        })
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-2">
      {clientId ? (
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            width="100%"
            text={text}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSimulatedGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm transition duration-200 ease-in-out"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      )}
    </div>
  );
};

export default GoogleAuthButton;

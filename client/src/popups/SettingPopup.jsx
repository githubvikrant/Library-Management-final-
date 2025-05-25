// import React from 'react'
import { useState} from "react";
import {updatePassword} from "../store/slices/authSlice"
import { useDispatch , useSelector} from "react-redux";
import settingIcon from "../assets/setting.png"
import closeIcon from "../assets/close-square.png"

import { toggleSettingPopup } from "../store/slices/popUpSlice"; // Import the function

const SettingPopup = () => {

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmNewPassword,setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
   
    const data = new FormData();
    data.append("currentPassword",currentPassword);
    data.append("newPassword",newPassword);
    data.append("confirmNewPassword",confirmNewPassword);
    dispatch(updatePassword(data));
    
  
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
  <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 m-4 sm:m-8 space-y-6">
    <div className="flex justify-between items-center pb-4">
      <header className="flex items-center space-x-2">
        <img src={settingIcon} alt="key icon" className="w-6 h-6" />
        <h3 className="text-xl font-semibold">change credentials</h3>
      </header>
      <button onClick={() => dispatch(toggleSettingPopup())}>
        <img src={closeIcon} alt="close icon" className="w-6 h-6" />
      </button>
    </div>

    <form onSubmit={handleUpdatePassword} className="space-y-4">
      <input
        type="password"
        placeholder="current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="confirm new Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
        <button
          type="button"
          onClick={() => dispatch(toggleSettingPopup())}
          className="w-full sm:w-1/3 py-3 bg-slate-300 text-black rounded-lg hover:bg-blue-400 transition"
        >
          Close
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-1/3 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
                {loading ?"loading":"confirm"}
        </button>
      </div>
    </form>
  </div>
</div>

  )
}

export default SettingPopup

import { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import {useSelector} from "react-redux";
import {toggleSettingPopup} from "../store/slices/popUpSlice.js"
import { useDispatch } from "react-redux";

const Header = () => {
 
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2,"0");
      const ampm = now.getHours >=12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${ampm}`);
      const options = {month: "short", date: "numeric", year:"numeric"};
      setCurrentDate(now.toLocaleDateString("en-US",options));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime,1000);

    return ()=> clearInterval(intervalId);
  },[]);

  return (
    <header className="bg-white w-full py-4 px-6 shadow-sm border-b border-gray-200 flex justify-between items-center z-10 flex-shrink-0">
      {/* Left side: Avatar and User Info */}
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300 overflow-hidden">
           {/* If user has an avatar URL, use it, else use default icon */}
           <img src={userIcon} alt="user icon" className="w-8 h-8 object-contain opacity-70" />
         </div>
         <div className="flex flex-col justify-center">
           <span className="text-base font-bold text-gray-900 leading-tight tracking-tight">
            {user ? user.name : "Guest"}
            </span>
           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            {user ? user.role : "Unknown"}
            </span>
         </div>
      </div>

      {/* Right side: Time and Settings */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col text-sm items-end font-medium text-gray-600">
          <span className="text-gray-900 font-bold">{currentTime}</span>
          <span className="text-xs">{currentDate}</span>
        </div>
        <div className="h-10 w-px bg-gray-300"></div>
        <button 
          onClick={()=> dispatch(toggleSettingPopup())}
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
        >
          <img src={settingIcon} alt="Settings" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;

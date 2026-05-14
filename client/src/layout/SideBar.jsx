import bookIcon from "../assets/book.png";
import logoutIcon from "../assets/logout.png";
import settingIcon from "../assets/setting-white.png";
import catalogIcon from "../assets/catalog.png";
import usersIcon from "../assets/people.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import logo_with_title from "../assets/logo-with-title.png";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { RiAdminFill } from "react-icons/ri";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";


/**
 * SideBar Component
 * Provides navigation links for the application. Refactored to use React Router <Link>
 * for proper browser history management.
 */
const SideBar = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector(state => state.popup);
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  // Helper to close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSideBarOpen(false);
    }
  };

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-30 transition-all duration-300 md:relative md:left-0 flex w-64 shrink-0 bg-black text-white flex-col h-full fixed top-0 bottom-0`}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" className="w-full object-contain" />
        </div>
        
        <nav className="flex-1 w-full space-y-1 overflow-y-auto mt-4">
          <NavLink
            to="/"
            end
            onClick={handleLinkClick}
            className={({ isActive }) => `w-full py-4 px-8 font-medium transition flex items-center space-x-4 ${isActive ? "bg-white text-black border-r-4 border-black" : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-900"}`}
          >
            {({ isActive }) => (
              <>
                <img src={dashboardIcon} alt="icon" className={`w-5 h-5 transition ${isActive ? "invert" : ""}`} />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/books"
            onClick={handleLinkClick}
            className={({ isActive }) => `w-full py-4 px-8 font-medium transition flex items-center space-x-4 ${isActive ? "bg-white text-black border-r-4 border-black" : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-900"}`}
          >
            {({ isActive }) => (
              <>
                <img src={bookIcon} alt="icon" className={`w-5 h-5 transition ${isActive ? "invert" : ""}`} />
                <span>Books</span>
              </>
            )}
          </NavLink>

          {isAuthenticated && user?.role === "admin" && (
            <>
              <NavLink
                to="/catalog"
                onClick={handleLinkClick}
                className={({ isActive }) => `w-full py-4 px-8 font-medium transition flex items-center space-x-4 ${isActive ? "bg-white text-black border-r-4 border-black" : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-900"}`}
              >
                {({ isActive }) => (
                  <>
                    <img src={catalogIcon} alt="icon" className={`w-5 h-5 transition ${isActive ? "invert" : ""}`} />
                    <span>Catalog</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/users"
                onClick={handleLinkClick}
                className={({ isActive }) => `w-full py-4 px-8 font-medium transition flex items-center space-x-4 ${isActive ? "bg-white text-black border-r-4 border-black" : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-900"}`}
              >
                {({ isActive }) => (
                  <>
                    <img src={usersIcon} alt="icon" className={`w-5 h-5 transition ${isActive ? "invert" : ""}`} />
                    <span>Users</span>
                  </>
                )}
              </NavLink>

              <button 
                className="w-full py-4 px-8 font-medium bg-transparent hover:bg-gray-900 transition flex items-center space-x-4 text-gray-400 hover:text-white"
                onClick={() => {
                  dispatch(toggleAddNewAdminPopup());
                  handleLinkClick();
                }}
              >
                <RiAdminFill className="w-5 h-5" />
                <span>Add new Admin</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "user" && (
            <>
              <NavLink
                to="/my-borrowed-books"
                onClick={handleLinkClick}
                className={({ isActive }) => `w-full py-4 px-8 font-medium transition flex items-center space-x-4 ${isActive ? "bg-white text-black border-r-4 border-black" : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-900"}`}
              >
                {({ isActive }) => (
                  <>
                    <img src={catalogIcon} alt="icon" className={`w-5 h-5 transition ${isActive ? "invert" : ""}`} />
                    <span>My Borrowed Books</span>
                  </>
                )}
              </NavLink>
            </>
          )}
    
          <button 
            className="md:hidden w-full py-4 px-8 font-medium bg-transparent text-gray-400 hover:text-white hover:bg-gray-900 transition flex items-center space-x-4" 
            onClick={() => {
              dispatch(toggleSettingPopup());
              handleLinkClick();
            }}
          >
            <img src={settingIcon} alt="icon" className="w-5 h-5" />
            <span>Update Credentials</span>
          </button>
        </nav>
     
        <div className="px-6 py-6 border-t border-gray-800">
          <button 
            className="w-full py-2 font-medium bg-transparent rounded-md hover:text-gray-300 transition flex items-center justify-center space-x-3" 
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="icon" className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsSideBarOpen(false)} 
          className="absolute top-4 right-4 md:hidden text-white p-2 hover:bg-gray-800 rounded-full transition"
        >
          <img src={closeIcon} alt="close" className="w-4 h-4" />
        </button>
      
      </aside>

      {/* Popups */}
      {addNewAdminPopup && <AddNewAdmin/>}
      {settingPopup && <SettingPopup/>}
    </>
  );
};

export default SideBar;

import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../layout/SideBar";
import Header from "../layout/Header";
import { useState } from "react";
import AddNewAdmin from "../popups/AddNewAdmin";

/**
 * Home Layout Component
 * Serves as the main layout wrapper for authenticated users, providing the Sidebar
 * and a content area (<Outlet />) for nested routes.
 */
const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  // Destructure auth state
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to register if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={"/register"} />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100 w-full overflow-hidden">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden z-20 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white cursor-pointer hover:bg-gray-800 transition">
          <GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>

        {/* Navigation Sidebar */}
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden w-full bg-gray-50">
          <Header />
          
          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto relative w-full">
            <Outlet />
          </div>
        </div>

      </div>
    </>
  );
};

export default Home;

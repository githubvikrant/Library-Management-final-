import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import { useState } from "react";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";
import AddNewAdmin from "../popups/AddNewAdmin";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/register"} />;
  }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
          <GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={setSelectedComponent}
        />
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user?.role === "user" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
             

            case "Books":
              return <BookManagement />;
             

            case "Catalog":
              if (user?.role === "admin") {
                return <Catalog />;
              }
              break;

            case "Users":
              if (user?.role === "admin") {
                return <Users />;
              }
              break;

            case "My_Borrowed_Books":
              return <MyBorrowedBooks />;

            case "Add_new_Admin":
                return <AddNewAdmin/>
             

            default:
              return user?.role === "user" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
             
          }
        })()}
      </div>
    </>
  );
};

export default Home;

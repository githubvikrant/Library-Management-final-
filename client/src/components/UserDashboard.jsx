import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useSelector,} from "react-redux";
import Header from "../layout/Header";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  // const { settingPopup } = useSelector((state) => state.popup);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let numberOfTotalBorrowedBooks = userBorrowedBooks.filter(
      (book) => book.returned === false
    );
    let numberOfTotalReturnedBooks = userBorrowedBooks.filter(
      (book) => book.returned === true
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
  <Header />

  <div className="flex flex-col-reverse xl:flex-row">
    {/* LEFT SIDE */}
    <div className="flex flex-[4] flex-col gap-7 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
      
      <div className="flex flex-col gap-7 flex-[4]">
        {/* Book List Cards */}
        <div className="flex flex-col gap-5 overflow-y-hidden">
          {/* Borrowed Book Card */}
          <div className="flex items-center gap-3 bg-white p-4 h-[80px] rounded-lg">
            <span className="w-[2px] bg-black h-full"></span>
            <span className="bg-gray-300 w-[60px] h-full flex justify-center items-center rounded-lg">
              <img src={bookIcon} alt="book-icon" className="w-6 h-6" />
            </span>
            <p className="text-base xl:text-lg font-medium">
              Your Borrowed Book List
            </p>
          </div>

          {/* Returned Book Card */}
          <div className="flex items-center gap-3 bg-white p-4 h-[80px] rounded-lg">
            <span className="w-[2px] bg-black h-full"></span>
            <span className="bg-gray-300 w-[60px] h-full flex justify-center items-center rounded-lg">
              <img src={returnIcon} alt="return-icon" className="w-6 h-6" />
            </span>
            <p className="text-base xl:text-lg font-medium">
              Your Returned Book List
            </p>
          </div>

          {/* Browse Inventory Card */}
          <div className="flex items-center gap-3 bg-white p-4 h-[80px] rounded-lg">
            <span className="w-[2px] bg-black h-full"></span>
            <span className="bg-gray-300 w-[60px] h-full flex justify-center items-center rounded-lg">
              <img src={browseIcon} alt="browse-icon" className="w-6 h-6" />
            </span>
            <p className="text-base xl:text-lg font-medium">
              Let&apos;s browse books inventory
            </p>
          </div>

          {/* BookWorm Center Logo */}
          <div className="flex justify-center items-center">
            <img
              src={logo_with_title}
              alt="BookWorm Library"
              className="w-[180px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Quote Box */}
      <div className="bg-white p-7 text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex justify-center items-center rounded-2xl">
        <h4 className="overflow-y-hidden">Embarking the journey of reading fosters personal growth, nurturing a path towards excellence and the refinement of character</h4>
        <p className="text-gray-700 text-sm sm:text-lg absolute right-[35px] sm:right-[78px] bottom-[10px]">
          ~ BookWorm Team
        </p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex-[2] flex-col gap-7 flex xl:flex-col justify-between xl:gap-10 py-5">
      {/* Pie Chart */}
      <div className="xl:flex-[4] flex items-center justify-center w-full">
        <Pie
          data={data}
          options={{ cutout: 0 }}
          className="mx-auto w-full h-auto"
        />
      </div>

      {/* Legend Card */}
      <div className="flex items-center p-6 w-full sm:w-[400px] xl:w-fit gap-5 bg-white rounded-lg">
        <img src={logo} alt="logo" className="w-auto h-12 2xl:h-20" />
        <span className="w-[2px] bg-black h-full"></span>
        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#D3D3E3]"></span>
            <span>Total Borrowed Books</span>
          </p>
          <p className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
            <span>Total Returned Books</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</main>

    </>
  );
};

export default UserDashboard;

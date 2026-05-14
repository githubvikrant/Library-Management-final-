import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IndianRupee, AlertTriangle, TrendingUp } from "lucide-react";
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

/**
 * UserDashboard Component
 * Displays the main landing view for standard users, featuring statistics,
 * quick navigation cards, and dynamic charts.
 */
// Fine rule (must match backend calculateFine.js): ₹10 per overdue day
const FINE_PER_DAY = 10;

const calculateOverdueDays = (returnDate) => {
  const now = new Date();
  const due = new Date(returnDate);
  if (due >= now) return 0;
  return Math.ceil((now - due) / (1000 * 60 * 60 * 24));
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  // FETCH DATA ON MOUNT
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    const isDemoMode = !userBorrowedBooks || userBorrowedBooks.length === 0;
    if (isDemoMode) {
      setTotalBorrowedBooks(12);
      setTotalReturnedBooks(8);
    } else {
      setTotalBorrowedBooks(
        userBorrowedBooks.filter((book) => !book.returnedAt).length
      );
      setTotalReturnedBooks(
        userBorrowedBooks.filter((book) => !!book.returnedAt).length
      );
    }
  }, [userBorrowedBooks]);

  // --- FINANCIAL CALCULATIONS ---
  const isDemoMode = !userBorrowedBooks || userBorrowedBooks.length === 0;

  const currentBooks = isDemoMode ? [] : (userBorrowedBooks?.filter((b) => !b.returnedAt) || []);
  const returnedBooksArr = isDemoMode ? [] : (userBorrowedBooks?.filter((b) => !!b.returnedAt) || []);

  const totalDueNow = currentBooks.reduce((acc, b) => {
    const price = b.price || b.bookId?.price || 0;
    const fine = calculateOverdueDays(b.returnDate) * FINE_PER_DAY;
    return acc + price + fine;
  }, 0);

  const totalOverdueFine = currentBooks.reduce((acc, b) => {
    return acc + calculateOverdueDays(b.returnDate) * FINE_PER_DAY;
  }, 0);

  const totalSpent = returnedBooksArr.reduce((acc, b) => {
    return acc + (b.price || b.bookId?.price || 0);
  }, 0);

  const data = {
    labels: ["Borrowed Books (Active)", "Returned Books (History)"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#111827", "#9CA3AF"], // Tailwind gray-900 and gray-400
        hoverBackgroundColor: ["#000000", "#6B7280"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-gray-500 mt-1">Here is a summary of your reading activity.</p>
          </div>

          {/* Top Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link to="/my-borrowed-books" className="group flex items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black transition">
                <img src={bookIcon} alt="borrowed" className="w-7 h-7 group-hover:invert transition" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Borrowed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalBorrowedBooks}</p>
              </div>
            </Link>

            <Link to="/my-borrowed-books" className="group flex items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black transition">
                <img src={returnIcon} alt="returned" className="w-7 h-7 group-hover:invert transition" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Returned</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalReturnedBooks}</p>
              </div>
            </Link>

            <Link to="/books" className="group flex items-center p-6 bg-black border border-black rounded-2xl shadow-sm hover:bg-gray-900 transition">
              <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                <img src={browseIcon} alt="browse" className="w-7 h-7" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-300 uppercase tracking-wider">Catalog</p>
                <p className="text-xl font-bold text-white mt-1">Browse Library</p>
              </div>
            </Link>

          </div>

          {/* --- FINANCIAL SUMMARY SECTION --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Due Now</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{isDemoMode ? 240 : totalDueNow}</p>
              <p className="text-xs text-gray-400 mt-1">for all currently borrowed books</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Spent</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{isDemoMode ? 380 : totalSpent}</p>
              <p className="text-xs text-gray-400 mt-1">across all returned books</p>
            </div>

            <div className={`rounded-2xl p-5 shadow-sm border ${
              (!isDemoMode && totalOverdueFine > 0)
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Overdue Fine</span>
              </div>
              <p className={`text-3xl font-bold ${
                (!isDemoMode && totalOverdueFine > 0) ? "text-red-600" : "text-gray-900"
              }`}>
                ₹{isDemoMode ? 0 : totalOverdueFine}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {(!isDemoMode && totalOverdueFine > 0)
                  ? `₹${FINE_PER_DAY}/day fine — return soon!`
                  : "No fines accrued"}
              </p>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Quote and Brand */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <div className="bg-white border border-gray-200 p-10 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                {/* Decorative background element */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                
                <h4 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight relative z-10">
                  "Embarking the journey of reading fosters personal growth, nurturing a path towards excellence and the refinement of character."
                </h4>
                <div className="mt-8 flex items-center gap-4 relative z-10">
                  <div className="w-12 h-[2px] bg-black"></div>
                  <p className="text-lg font-medium text-gray-600">The BookWorm Team</p>
                </div>
              </div>

              <div className="flex items-center justify-center p-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
                <img src={logo_with_title} alt="BookWorm Library" className="h-16 object-contain opacity-80 hover:opacity-100 transition" />
              </div>

            </div>

            {/* Right side: Chart */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-gray-900 w-full text-left mb-8">Reading Analytics</h3>
              
              <div className="w-full max-w-[250px] aspect-square relative">
                <Pie
                  data={data}
                  options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                  className="w-full h-full"
                />
                {/* Center text for donut chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-gray-900">{totalBorrowedBooks + totalReturnedBooks}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="mt-10 w-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-gray-900"></span>
                    <span className="text-sm font-medium text-gray-700">Active Borrowed</span>
                  </div>
                  <span className="font-bold text-gray-900">{totalBorrowedBooks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                    <span className="text-sm font-medium text-gray-700">Returned History</span>
                  </div>
                  <span className="font-bold text-gray-900">{totalReturnedBooks}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default UserDashboard;

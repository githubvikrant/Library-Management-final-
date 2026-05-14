import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { IndianRupee, TrendingUp, AlertTriangle } from "lucide-react";
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
 * AdminDashboard Component
 * Provides administrators with high-level statistics, user management overviews,
 * and system-wide book analytics. Features premium Tailwind UI and dummy data fallback.
 */
const FINE_PER_DAY = 10;

const calcOverdueDays = (returnDate) => {
  const now = new Date();
  const due = new Date(returnDate);
  if (due >= now) return 0;
  return Math.ceil((now - due) / (1000 * 60 * 60 * 24));
};

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    // Dummy data integration for demo/interview purposes
    const isDemoMode = !users || users.length === 0;

    if (isDemoMode) {
      setTotalUsers(145);
      setTotalAdmin(3);
      setTotalBooks(1240);
      setTotalBorrowedBooks(450);
      setTotalReturnedBooks(1200);
    } else {
      let numberOfUsers = users.filter((u) => u.role === "user");
      let numberOfAdmins = users.filter((u) => u.role === "admin");
      setTotalUsers(numberOfUsers.length);
      setTotalAdmin(numberOfAdmins.length);
      setTotalBooks(books ? books.length : 0);

      let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
        (book) => book.returnedAt === null
      );
      let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
        (book) => book.returnedAt !== null
      );
      setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
      setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
    }
  }, [users, books, allBorrowedBooks]);

  // --- FINANCIAL ACCOUNTING (from allBorrowedBooks + books) ---
  const isDemoMode = !users || users.length === 0;

  // Total revenue = sum of book prices for ALL returned borrows
  const totalRevenue = isDemoMode ? 12400 : (allBorrowedBooks || []).reduce((acc, b) => {
    if (!b.returnedAt) return acc;
    const book = books?.find((bk) => bk._id?.toString() === b.bookId?.toString());
    return acc + (book?.price || b.price || 0);
  }, 0);

  // Total outstanding = price of all currently borrowed (unreturned) books + their fines
  const totalOutstanding = isDemoMode ? 3200 : (allBorrowedBooks || []).reduce((acc, b) => {
    if (b.returnedAt) return acc;
    const book = books?.find((bk) => bk._id?.toString() === b.bookId?.toString());
    const price = book?.price || b.price || 0;
    const fine = calcOverdueDays(b.returnDate) * FINE_PER_DAY;
    return acc + price + fine;
  }, 0);

  // Total fines accrued on overdue books
  const totalFines = isDemoMode ? 450 : (allBorrowedBooks || []).reduce((acc, b) => {
    if (b.returnedAt) return acc;
    return acc + calcOverdueDays(b.returnDate) * FINE_PER_DAY;
  }, 0);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#111827", "#9CA3AF"],
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
            <p className="text-gray-500 mt-1">System-wide statistics and management overview.</p>
          </div>

          {/* Top Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Users */}
            <div className="flex items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <img src={usersIcon} alt="users" className="w-7 h-7" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
              </div>
            </div>

            {/* Total Books */}
            <div className="flex items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <img src={bookIcon} alt="books" className="w-7 h-7" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Books</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalBooks}</p>
              </div>
            </div>

            {/* Total Admins */}
            <div className="flex items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <img src={adminIcon} alt="admin" className="w-7 h-7" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">System Admins</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalAdmin}</p>
              </div>
            </div>

          </div>

          {/* --- FINANCIAL ACCOUNTING SECTION --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{totalRevenue}</p>
              <p className="text-xs text-gray-400 mt-1">collected from returned books</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Outstanding Dues</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{totalOutstanding}</p>
              <p className="text-xs text-gray-400 mt-1">from active borrowers</p>
            </div>

            <div className={`rounded-2xl p-5 shadow-sm border ${
              !isDemoMode && totalFines > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Overdue Fines</span>
              </div>
              <p className={`text-3xl font-bold ${
                !isDemoMode && totalFines > 0 ? "text-red-600" : "text-gray-900"
              }`}>₹{totalFines}</p>
              <p className="text-xs text-gray-400 mt-1">accruing at ₹{FINE_PER_DAY}/day per book</p>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Profile Card & Quote */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Profile Card */}
              <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm flex items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={user?.avatar?.url || "https://ui-avatars.com/api/?name=Admin&background=000&color=fff"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name || "Administrator"}</h2>
                  <p className="text-gray-500 mt-2 max-w-md">
                    Welcome to your admin dashboard. Here you can manage settings, monitor statistics, and oversee the entire library system.
                  </p>
                </div>
              </div>

              {/* Quote Card */}
              <div className="bg-black border border-black p-10 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[250px]">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <h4 className="text-xl md:text-3xl font-bold text-white leading-tight relative z-10 italic">
                  "A library is not a luxury but one of the necessities of life."
                </h4>
                <div className="mt-8 flex items-center gap-4 relative z-10">
                  <div className="w-12 h-[2px] bg-white"></div>
                  <p className="text-lg font-medium text-gray-300">Henry Ward Beecher</p>
                </div>
              </div>

            </div>

            {/* Right side: Chart */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-gray-900 w-full text-left mb-8">System Analytics</h3>
              
              <div className="w-full max-w-[250px] aspect-square relative">
                <Pie
                  data={data}
                  options={{ cutout: '70%', plugins: { legend: { display: false } } }}
                  className="w-full h-full"
                />
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
                    <span className="text-sm font-medium text-gray-700">Total Borrowed</span>
                  </div>
                  <span className="font-bold text-gray-900">{totalBorrowedBooks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                    <span className="text-sm font-medium text-gray-700">Total Returned</span>
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

export default AdminDashboard;

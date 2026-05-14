import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserBorrowedBooks,
  returnBook,
  resetBorrowSlice,
} from "../store/slices/borrowSlice.js";
import { fetchAllBooks } from "../store/slices/bookSlice.js";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import ReadBookPopup from "../popups/ReadBookPopup";
import { toast } from "react-toastify";
import {
  BookOpen,
  CheckCircle,
  Clock,
  ArchiveX,
  BookOpenCheck,
  CornerDownLeft,
  IndianRupee,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// Fine rule (must match backend): ₹10 per overdue day
const FINE_PER_DAY = 10;

const calculateOverdueDays = (returnDate) => {
  const now = new Date();
  const due = new Date(returnDate);
  if (due >= now) return 0;
  return Math.ceil((now - due) / (1000 * 60 * 60 * 24));
};

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks, message, error } = useSelector(
    (state) => state.borrow
  );
  const { readBookPopup } = useSelector((state) => state.popup);
  const { user } = useSelector((state) => state.auth);

  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("current");

  // State for inline return confirmation modal
  const [returnConfirm, setReturnConfirm] = useState(null); // { bookId, bookTitle, price, returnDate }

  const openReturnConfirm = (book) => {
    setReturnConfirm({
      // bookId in Borrow doc is an object when populated
      bookId: book.bookId?._id || book.bookId,
      bookTitle: book.bookId?.title || "Unknown Book",
      price: book.price || 0,
      returnDate: book.returnDate,
    });
  };

  const confirmReturn = () => {
    if (!returnConfirm) return;
    dispatch(returnBook(user?.email, returnConfirm.bookId));
    setReturnConfirm(null);
  };

  const openReadPopup = (bookId) => {
    const book = books?.find((b) => b._id === bookId);
    setReadBook(book || {});
    dispatch(toggleReadBookPopup());
  };

  useEffect(() => {
    const successMsg = message;
    const errorMsg = error;
    if (successMsg) {
      dispatch(resetBorrowSlice());
      toast.success(successMsg);
      dispatch(fetchUserBorrowedBooks());
      dispatch(fetchAllBooks());
    }
    if (errorMsg) {
      dispatch(resetBorrowSlice());
      toast.error(errorMsg);
    }
  }, [dispatch, message, error]);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "—";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const isOverdue = (returnDate) => new Date(returnDate) < new Date();

  // Borrow collection shape: returnedAt (Date|null) instead of returned (boolean)
  const currentBooks = userBorrowedBooks?.filter((b) => !b.returnedAt) || [];
  const returnedBooks = userBorrowedBooks?.filter((b) => !!b.returnedAt) || [];
  const booksToDisplay = filter === "current" ? currentBooks : returnedBooks;

  // Financial summary calculations
  const totalAmountSpent = returnedBooks.reduce((acc, b) => {
    return acc + (b.price || b.bookId?.price || 0);
  }, 0);

  const totalDueNow = currentBooks.reduce((acc, b) => {
    const price = b.price || b.bookId?.price || 0;
    const fine = calculateOverdueDays(b.returnDate) * FINE_PER_DAY;
    return acc + price + fine;
  }, 0);

  const totalOverdueFine = currentBooks.reduce((acc, b) => {
    return acc + calculateOverdueDays(b.returnDate) * FINE_PER_DAY;
  }, 0);

  return (
    <>
      <main className="p-8 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Borrowed Books
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your active loans, return books, and view your spending.
            </p>
          </div>

          {/* --- FINANCIAL SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Active Loans</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{currentBooks.length}</p>
              <p className="text-xs text-gray-400 mt-1">books currently with you</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Due Now</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{totalDueNow}</p>
              <p className="text-xs text-gray-400 mt-1">
                includes ₹{totalOverdueFine} in overdue fines
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Spent</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{totalAmountSpent}</p>
              <p className="text-xs text-gray-400 mt-1">across {returnedBooks.length} returned books</p>
            </div>
          </div>

          {/* --- OVERDUE RULES INFO CARD --- */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-2">📋 Library Fine Rules</p>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Each book is due <strong>7 days</strong> after borrowing.</li>
                  <li>Overdue fine: <strong>₹{FINE_PER_DAY} per day</strong> after the due date.</li>
                  <li>Total charge on return = <strong>Book Price + (Overdue Days × ₹{FINE_PER_DAY})</strong></li>
                  <li>No fine if returned on or before the due date.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-gray-200 p-1 rounded-lg w-full md:w-auto md:inline-flex">
            <button
              className={`flex-1 md:w-44 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md transition-all ${filter === "current"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                }`}
              onClick={() => setFilter("current")}
            >
              <BookOpenCheck className="w-4 h-4" />
              Currently Borrowed
            </button>
            <button
              className={`flex-1 md:w-44 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md transition-all ${filter === "returned"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                }`}
              onClick={() => setFilter("returned")}
            >
              <CheckCircle className="w-4 h-4" />
              Returned Books
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {booksToDisplay && booksToDisplay.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="px-6 py-4">Book Title</th>
                      <th className="px-6 py-4">Borrowed On</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Price</th>
                      {filter === "current" && <th className="px-6 py-4">Est. Fine</th>}
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {booksToDisplay.map((book, index) => {
                      const price = book.price || book.bookId?.price || 0;
                      const overdueDays = calculateOverdueDays(book.returnDate);
                      const fine = overdueDays * FINE_PER_DAY;
                      const displayTitle = book.bookId?.title || "Unknown Book";

                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {/* Book Title */}
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{displayTitle}</span>
                          </td>

                          {/* Borrowed On */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{formatDate(book.borrowedAt || book.createdAt)}</span>
                          </td>

                          {/* Due Date */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              {!book.returnedAt && isOverdue(book.returnDate) && (
                                <Clock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                              )}
                              <span className={`text-sm font-medium ${!book.returnedAt && isOverdue(book.returnDate)
                                  ? "text-red-600" : "text-gray-900"
                                }`}>
                                {formatDate(book.returnDate)}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">₹{price}</span>
                          </td>

                          {/* Estimated Fine (current only) */}
                          {filter === "current" && (
                            <td className="px-6 py-4">
                              {fine > 0 ? (
                                <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  ₹{fine}
                                </span>
                              ) : (
                                <span className="text-sm text-green-600 font-medium">None</span>
                              )}
                            </td>
                          )}

                          {/* Status */}
                          <td className="px-6 py-4">
                            {book.returnedAt ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" /> Returned
                              </span>
                            ) : isOverdue(book.returnDate) ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Clock className="w-3 h-3" /> Overdue
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <BookOpen className="w-3 h-3" /> Active
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => openReadPopup(book.bookId?._id || book.bookId)}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                                title="View Book Details"
                              >
                                <BookOpen className="w-4 h-4" />
                              </button>
                              {!book.returnedAt && (
                                <button
                                  onClick={() => openReturnConfirm(book)}
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                  title="Return this book"
                                >
                                  <CornerDownLeft className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ArchiveX className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {filter === "current" ? "No active loans" : "No returned books yet"}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  {filter === "current"
                    ? "You haven't borrowed any books yet. Browse the Books page to get started!"
                    : "Books you return will appear here for your records."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- INLINE RETURN CONFIRMATION MODAL --- */}
      {returnConfirm && (() => {
        const overdueDays = calculateOverdueDays(returnConfirm.returnDate);
        const fine = overdueDays * FINE_PER_DAY;
        const totalCharge = returnConfirm.price + fine;
        return (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Confirm Book Return</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{returnConfirm.bookTitle}</p>
                </div>
                <button
                  onClick={() => setReturnConfirm(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Charges Breakdown */}
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Book Price</span>
                  <span className="font-semibold text-gray-900">₹{returnConfirm.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Overdue Fine{overdueDays > 0 ? ` (${overdueDays} days × ₹${FINE_PER_DAY})` : ""}
                  </span>
                  <span className={`font-semibold ${fine > 0 ? "text-red-600" : "text-green-600"}`}>
                    {fine > 0 ? `₹${fine}` : "None"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Total Charge</span>
                  <span className="text-lg font-bold text-gray-900">₹{totalCharge}</span>
                </div>

                {fine > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                    This book is <strong>{overdueDays} day{overdueDays > 1 ? "s" : ""} overdue</strong>. A fine of ₹{FINE_PER_DAY}/day applies.
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={() => setReturnConfirm(null)}
                  className="flex-1 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReturn}
                  className="flex-1 py-2.5 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;

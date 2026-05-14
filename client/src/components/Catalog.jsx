import { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  updateReturnDate,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { resetBookSlice } from "../store/slices/bookSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import { ArchiveX, Clock, BookOpenCheck, CalendarDays, X } from "lucide-react";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );
  const { books } = useSelector((state) => state.book);

  const [filter, setFilter] = useState("borrowed");

  // Return popup state — carries all props needed by ReturnBookPopup
  const [returnInfo, setReturnInfo] = useState({
    bookId: "",
    email: "",
    bookPrice: 0,
    returnDate: null,
    bookTitle: "",
  });

  // Edit Due Date modal state
  const [editDueDateModal, setEditDueDateModal] = useState(null); // { borrowId, currentReturnDate }
  const [newReturnDate, setNewReturnDate] = useState("");

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  // Convert to YYYY-MM-DD for <input type="date">
  const toInputDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  const currentDate = new Date();

  // Remove demo data fallback so admin sees actual empty state
  const sourceData = allBorrowedBooks || [];

  const activeBorrowers = sourceData?.filter((book) => {
    const returnDate = new Date(book.returnDate);
    return returnDate > currentDate && !book.returnedAt;
  });

  const overdueBorrowers = sourceData?.filter((book) => {
    const returnDate = new Date(book.returnDate);
    return returnDate <= currentDate && !book.returnedAt;
  });

  const booksToDisplay =
    filter === "borrowed" ? activeBorrowers : overdueBorrowers;

  // Open return popup — pass all required props
  const openReturnBookPopup = (book) => {
    setReturnInfo({
      bookId: book.bookId?._id || book.bookId,
      email: book?.user?.email,
      bookPrice: book.price || 0,
      returnDate: book.returnDate,
      bookTitle: book.bookId?.title || "Unknown Book",
    });
    dispatch(toggleReturnBookPopup());
  };

  // Open edit due date modal
  const openEditDueDateModal = (book) => {
    setEditDueDateModal({ borrowId: book._id, currentReturnDate: book.returnDate });
    setNewReturnDate(toInputDate(book.returnDate));
  };

  const confirmEditDueDate = () => {
    if (!editDueDateModal || !newReturnDate) return;
    dispatch(updateReturnDate(editDueDateModal.borrowId, newReturnDate));
    setEditDueDateModal(null);
  };

  // Fetch all borrowed books on initial mount
  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  // Handle success/error notifications
  useEffect(() => {
    // Capture values BEFORE any reset clears them
    const successMsg = message;
    const errorMsg = error;

    if (successMsg) {
      toast.success(successMsg);
      // Reset after toast is queued
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
      // Re-fetch so UI reflects latest state
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
    }
    if (errorMsg) {
      toast.error(errorMsg);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, loading, message]);

  return (
    <>
      <main className="p-8 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Catalog Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitor active book loans, track overdue borrowers, and manage due dates.
              </p>
            </div>

            {/* Premium Toggle Button */}
            <div className="flex bg-gray-200 p-1 rounded-lg w-full md:w-auto">
              <button
                className={`flex-1 md:w-48 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  filter === "borrowed"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setFilter("borrowed")}
              >
                <BookOpenCheck className="w-4 h-4" />
                Borrowed Books
              </button>
              <button
                className={`flex-1 md:w-48 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  filter === "nonReturned"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setFilter("nonReturned")}
              >
                <Clock className="w-4 h-4" />
                Overdue Books
              </button>
            </div>
          </div>

          {/* Data Grid Section */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {booksToDisplay && booksToDisplay.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="px-6 py-4">Borrower</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Borrowed On</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {booksToDisplay.map((book, index) => (
                      <tr
                        key={book._id || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Borrower Info */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {book?.user?.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {book?.user?.email}
                            </span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            ₹{book.price}
                          </span>
                        </td>

                        {/* Borrowed On */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {formatDateAndTime(book.createdAt)}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${
                              filter === "nonReturned"
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {formatDate(book.returnDate)}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          {book.returnedAt ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Returned
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                filter === "nonReturned"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {filter === "nonReturned" ? "Overdue" : "Active"}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-2">
                            {book.returnedAt ? (
                              <FaSquareCheck
                                className="w-5 h-5 text-gray-400"
                                title="Already returned"
                              />
                            ) : (
                              <>
                                {/* Edit Due Date button */}
                                <button
                                  onClick={() => openEditDueDateModal(book)}
                                  className="flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Edit Due Date"
                                >
                                  <CalendarDays className="w-5 h-5" />
                                </button>

                                {/* Return Book button */}
                                <button
                                  onClick={() => openReturnBookPopup(book)}
                                  className="flex items-center justify-center p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                                  title="Mark as Returned"
                                >
                                  <PiKeyReturnBold className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ArchiveX className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No {filter === "borrowed" ? "active book loans" : "overdue books"} found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  {filter === "borrowed"
                    ? "There are currently no active book loans in the system."
                    : "Great news! There are no overdue books at the moment."}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Return Book Popup — now receives all props */}
      {returnBookPopup && (
        <ReturnBookPopup
          bookId={returnInfo.bookId}
          email={returnInfo.email}
          bookPrice={returnInfo.bookPrice}
          returnDate={returnInfo.returnDate}
          bookTitle={returnInfo.bookTitle}
        />
      )}

      {/* Edit Due Date Inline Modal */}
      {editDueDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Edit Due Date</h3>
                  <p className="text-xs text-gray-500">
                    Current: {formatDate(editDueDateModal.currentReturnDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditDueDateModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  New Return Date
                </label>
                <input
                  type="date"
                  value={newReturnDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewReturnDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                />
              </div>
              {newReturnDate && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                  New due date will be set to{" "}
                  <strong>{formatDate(newReturnDate)}</strong>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setEditDueDateModal(null)}
                className="flex-1 py-2.5 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmEditDueDate}
                disabled={!newReturnDate}
                className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Date
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Catalog;

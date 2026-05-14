/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import { useState } from "react";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { BookA, X } from "lucide-react";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  // Get the currently logged-in user from Redux auth state
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // Admins type in the borrower's email; regular users borrow for themselves
  const [adminEmail, setAdminEmail] = useState("");

  const handleRecordBook = (e) => {
    e.preventDefault();
    if (isAdmin) {
      // Admin: send the email they typed so the backend looks up that user
      dispatch(recordBorrowBook(adminEmail, bookId));
    } else {
      // Regular user: send no email so the backend uses req.user (the logged-in user)
      dispatch(recordBorrowBook("", bookId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 p-5 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-11/12 bg-white rounded-2xl shadow-xl sm:w-96">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
              <BookA className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Borrow Book</h3>
              <p className="text-xs text-gray-500">
                {isAdmin ? "Record a borrow on behalf of a user" : "Confirm your borrow request"}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleRecordBookPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleRecordBook} className="p-6 space-y-4">
          
          {isAdmin ? (
            /* Admin: show email input to specify which user is borrowing */
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Borrower&apos;s Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter the user's email address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-400 mt-1">The book will be recorded under this user's account.</p>
            </div>
          ) : (
            /* Regular user: just confirm — we know who they are */
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Borrowing as <span className="font-bold text-gray-900">{user?.name}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => dispatch(toggleRecordBookPopup())}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Confirm Borrow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;

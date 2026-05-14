/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { CornerDownLeft, X, Mail, AlertTriangle } from "lucide-react";

// Fine rule: ₹10 per overdue day (matches backend calculateFine.js)
const FINE_PER_DAY = 10;

const calcOverdueDays = (returnDate) => {
  if (!returnDate) return 0;
  const now = new Date();
  const due = new Date(returnDate);
  if (due >= now) return 0;
  return Math.ceil((now - due) / (1000 * 60 * 60 * 24));
};

/**
 * ReturnBookPopup — used by Admin from the Catalog page.
 * Props:
 *   bookId     — MongoDB _id of the book to return
 *   email      — email of the borrower
 *   bookTitle  — (optional) title to display
 *   bookPrice  — (optional) price to show charge breakdown
 *   returnDate — (optional) due date to calculate overdue fine
 */
const ReturnBookPopup = ({ bookId, email, bookTitle, bookPrice = 0, returnDate }) => {
  const dispatch = useDispatch();

  const overdueDays = calcOverdueDays(returnDate);
  const fine = overdueDays * FINE_PER_DAY;
  const totalCharge = bookPrice + fine;

  const handleReturn = (e) => {
    e.preventDefault();
    dispatch(returnBook(email, bookId));
    dispatch(toggleReturnBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <CornerDownLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Return Book</h3>
              {bookTitle && (
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{bookTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleReturnBookPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleReturn} className="px-6 py-5 space-y-4">

          {/* Borrower email (read-only) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <Mail className="w-3.5 h-3.5" /> Borrower
            </label>
            <div className="px-3 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-sm text-gray-700 font-medium">
              {email}
            </div>
          </div>

          {/* Charge breakdown (only if price/returnDate provided) */}
          {bookPrice > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Book Price</span>
                <span className="font-semibold text-gray-900">₹{bookPrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Overdue Fine{overdueDays > 0 ? ` (${overdueDays}d × ₹${FINE_PER_DAY})` : ""}
                </span>
                <span className={`font-semibold ${fine > 0 ? "text-red-600" : "text-green-600"}`}>
                  {fine > 0 ? `₹${fine}` : "None"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total Charge</span>
                <span className="text-base font-bold text-gray-900">₹{totalCharge}</span>
              </div>
              {fine > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    <strong>{overdueDays} day{overdueDays > 1 ? "s" : ""} overdue</strong> — ₹{FINE_PER_DAY}/day fine applies.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => dispatch(toggleReturnBookPopup())}
              className="flex-1 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Confirm Return
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;

/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { X, BookOpen, User, Building, Hash, Tag, AlignLeft } from "lucide-react";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Book Details</h3>
              <p className="text-xs text-gray-500">Full information about this book</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Book Cover + Title */}
          <div className="flex gap-4 items-start">
            {book.image && (
              <img src={book.image} alt={book.title} className="w-16 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{book.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Publisher</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{book.publisher || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rent Price</span>
              </div>
              <p className="text-sm font-bold text-gray-900">₹{book.price}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Stock</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{book.quantity ?? "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                book.quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {book.quantity > 0 ? "Available" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{book.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="w-full py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReadBookPopup;

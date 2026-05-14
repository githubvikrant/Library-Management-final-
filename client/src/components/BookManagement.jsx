import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookA, NotebookPen, Pencil, Search, Plus, ArchiveX, PackagePlus, X } from "lucide-react";
import {
  toggleAddBookPopup,
  toggleEditBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice, restockBook, updateBook } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import AddBookPopup from "../popups/AddBookPopup";
import EditBookPopup from "../popups/EditBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, editBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const [editBook, setEditBook] = useState(null);
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  // Restock modal: stores { bookId, bookTitle, currentQty } or null
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState(1);

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openEditPopup = (book) => {
    setEditBook(book);
    dispatch(toggleEditBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const openRestockModal = (book) => {
    setRestockQty(1);
    setRestockModal({ bookId: book._id, bookTitle: book.title, currentQty: book.quantity });
  };

  const confirmRestock = () => {
    if (!restockModal || restockQty < 1) return;
    dispatch(restockBook(restockModal.bookId, restockQty));
    setRestockModal(null);
  };

  // Fetch books on mount. Only admins can fetch ALL borrowed books.
  useEffect(() => {
    dispatch(fetchAllBooks());
    if (user?.role === "admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, user?.role]);

  // Handle success and error notifications, then re-fetch fresh data
  useEffect(() => {
    // Capture the message before any resets clear it
    const successMsg = message || borrowSliceMessage;
    const errorMsg = error || borrowSliceError;

    if (successMsg) {
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
      toast.success(successMsg);
      // Re-fetch books for all users; only fetch all borrow records for admin
      dispatch(fetchAllBooks());
      if (user?.role === "admin") {
        dispatch(fetchAllBorrowedBooks());
      }
    }
    if (errorMsg) {
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
      toast.error(errorMsg);
    }
  }, [
    dispatch,
    message,
    error,
    loading,
    borrowSliceError,
    borrowSliceLoading,
    borrowSliceMessage,
  ]);

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value);
  };

  // --- DUMMY DATA LOGIC FOR INTERVIEW DEMO ---
  const isDemoMode = !books || books.length === 0;
  
  const dummyBooks = [
    { _id: "1", title: "The Pragmatic Programmer", author: "Andrew Hunt", quantity: 5, price: 45 },
    { _id: "2", title: "Clean Code", author: "Robert C. Martin", quantity: 12, price: 50 },
    { _id: "3", title: "Design Patterns", author: "Erich Gamma", quantity: 0, price: 60 },
    { _id: "4", title: "Refactoring", author: "Martin Fowler", quantity: 3, price: 55 },
    { _id: "5", title: "Code Complete", author: "Steve McConnell", quantity: 8, price: 40 }
  ];

  const sourceBooks = isDemoMode ? dummyBooks : books;

  const searchedBooks = sourceBooks.filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword.toLowerCase())
  );

  return (
    <>
      <main className="p-8 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {user && user.role === "admin" ? "Inventory Management" : "Library Books"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {user && user.role === "admin" 
                  ? "Manage your library's catalog, quantities, and pricing." 
                  : "Browse the complete collection of available books."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow shadow-sm"
                  value={searchedKeyword}
                  onChange={handleSearch}
                />
              </div>

              {/* Add Book Button (Admin Only) */}
              {(!user || user?.role === "admin") && (
                <button
                  onClick={() => dispatch(toggleAddBookPopup())}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Book
                </button>
              )}
            </div>
          </div>

          {/* Data Grid Section */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {searchedBooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="px-6 py-4">Title & Author</th>
                      {(!user || user?.role === "admin") && (
                        <th className="px-6 py-4">Inventory</th>
                      )}
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {searchedBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Title & Author */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{book.title}</span>
                            <span className="text-sm text-gray-500">{book.author}</span>
                          </div>
                        </td>

                        {/* Inventory (Admin Only) */}
                        {(!user || user?.role === "admin") && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{book.quantity}</span>
                              <span className="text-xs text-gray-500">in stock</span>
                            </div>
                          </td>
                        )}

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">${book.price}</span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.quantity > 0 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {book.quantity > 0 ? "Available" : "Out of Stock"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-3">
                            <button 
                              onClick={() => openReadPopup(book._id)}
                              className="text-gray-400 hover:text-black transition-colors"
                              title="View Details"
                            >
                              <NotebookPen className="w-5 h-5" />
                            </button>
                            
                            {/* Edit Button (Admin Only) */}
                            {user?.role === "admin" && (
                              <button
                                onClick={() => openEditPopup(book)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit Book"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                            )}

                            {/* Borrow Button */}
                            {book.quantity > 0 && (
                              <button 
                                onClick={() => openRecordBookPopup(book._id)}
                                className="text-gray-400 hover:text-green-600 transition-colors"
                                title="Borrow Book"
                              >
                                <BookA className="w-5 h-5" />
                              </button>
                            )}

                            {/* Restock Button (Admin Only) */}
                            {user?.role === "admin" && (
                              <button
                                onClick={() => openRestockModal(book)}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                                title="Restock: Add Copies"
                              >
                                <PackagePlus className="w-5 h-5" />
                              </button>
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
                <h3 className="text-lg font-bold text-gray-900 mb-1">No books found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We couldn't find any books matching your search criteria. Try adjusting your keywords.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Popups */}
      {addBookPopup && <AddBookPopup />}
      {editBookPopup && editBook && <EditBookPopup book={editBook} />}
      {readBookPopup && <ReadBookPopup key={readBook._id} book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}

      {/* --- INLINE RESTOCK MODAL --- */}
      {restockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                  <PackagePlus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Restock Book</h3>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{restockModal.bookTitle}</p>
                </div>
              </div>
              <button onClick={() => setRestockModal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Current stock</span>
                <span className="font-bold text-gray-900">{restockModal.currentQty} copies</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Copies to Add</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
                New total will be <strong>{restockModal.currentQty + (restockQty || 0)} copies</strong>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setRestockModal(null)} className="flex-1 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={confirmRestock} className="flex-1 py-2.5 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800">
                Add Copies
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookManagement;

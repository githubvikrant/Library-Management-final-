/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBook } from "../store/slices/bookSlice";
import { toggleEditBookPopup } from "../store/slices/popUpSlice";
import {
  BookOpen,
  X,
  Image,
  Type,
  User,
  DollarSign,
  Building,
  AlignLeft,
  Star,
} from "lucide-react";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder:text-gray-400";

/**
 * EditBookPopup — Admin can update any field of an existing book.
 * Props: book — the full book object from Redux state
 */
const EditBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [price, setPrice] = useState(book?.price || "");
  const [description, setDescription] = useState(book?.description || "");
  const [image, setImage] = useState(book?.image || "");
  const [publisher, setPublisher] = useState(book?.publisher || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      title,
      author,
      price: Number(price),
      description,
      publisher,
      ...(image && { image }),
    };
    dispatch(updateBook(book._id, data));
    dispatch(toggleEditBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Book</h3>
              <p className="text-xs text-gray-500 truncate max-w-[220px]">
                {book?.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleEditBookPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Book Title" icon={Type}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Clean Code"
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              <Field label="Author" icon={User}>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="Publisher" icon={Building}>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Publisher"
                  className={inputCls}
                  required
                />
              </Field>

              <div className="col-span-2">
                <Field label="Rent Price (₹)" icon={DollarSign}>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 50"
                    className={inputCls}
                    required
                    min="1"
                  />
                </Field>
              </div>

              <div className="col-span-2">
                <Field label="Cover Image URL" icon={Image}>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className={inputCls}
                  />
                  {image && (
                    <div className="mt-2 w-12 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={image}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className="col-span-2">
                <Field label="Description / Review" icon={AlignLeft}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description or review of the book..."
                    rows={4}
                    className={inputCls + " resize-none"}
                    required
                  />
                </Field>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Star className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Changes will apply immediately to the live catalog. Quantity and stock are managed separately via the Restock option.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={() => dispatch(toggleEditBookPopup())}
              className="flex-1 py-2.5 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditBookPopup;

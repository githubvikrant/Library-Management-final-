/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { BookPlus, X, Image, Type, User, Hash, DollarSign, Building, AlignLeft } from "lucide-react";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder:text-gray-400";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [publisher, setPublisher] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("publisher", publisher);
    dispatch(addBook(formData));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <BookPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Add New Book</h3>
              <p className="text-xs text-gray-500">Fill in the details to add a book to the catalog</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleAddBookPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleAddBook} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Book Title" icon={Type}>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Clean Code" className={inputCls} required />
                </Field>
              </div>
              <Field label="Author" icon={User}>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className={inputCls} required />
              </Field>
              <Field label="Publisher" icon={Building}>
                <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Publisher" className={inputCls} required />
              </Field>
              <Field label="Rent Price (₹)" icon={DollarSign}>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 50" className={inputCls} required min="1" />
              </Field>
              <Field label="Quantity" icon={Hash}>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 10" className={inputCls} required min="1" />
              </Field>
              <div className="col-span-2">
                <Field label="Cover Image URL" icon={Image}>
                  <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className={inputCls} required />
                  {image && (
                    <div className="mt-2 w-12 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={image} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Description" icon={AlignLeft}>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the book..." rows={3} className={inputCls + " resize-none"} required />
                </Field>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopup())}
              className="flex-1 py-2.5 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Add Book
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddBookPopup;

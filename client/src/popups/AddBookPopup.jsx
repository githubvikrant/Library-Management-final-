import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

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
    dispatch(fetchAllBooks());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-11/12 bg-white rounded-lg shadow-lg sm:w-1/2 lg:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Add Book</h3>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Book title"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Book Author"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Rent Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Book Price"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book image
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="image url"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Publisher
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Publisher"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book description
                </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}placeholder="Book Description" rows={4} className="w-full px-4 py-2 border-2 border-black rounded-md"/>
               
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    dispatch(toggleAddBookPopup());
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import placeholder from "../assets/placeholder.jpg"
const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      }
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    dispatch(addNewAdmin(formData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
  <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 m-4 sm:m-8 space-y-6">
    <div className="flex justify-between items-center pb-4">
      <header className="flex items-center space-x-2">
        <img src={keyIcon} alt="key icon" className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Add New Admin</h3>
      </header>
      <button onClick={() => dispatch(toggleAddNewAdminPopup())}>
        <img src={closeIcon} alt="close icon" className="w-6 h-6" />
      </button>
    </div>

    <form onSubmit={handleAddNewAdmin} className="space-y-4">
      <label className="cursor-pointer flex justify-center">
        <img
          src={avatarPreview ? avatarPreview : placeholder}
          alt="avatar"
          className="w-24 h-24 sm:w-24 sm:h-24 max-w-[6rem] rounded-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
        <button
          type="button"
          onClick={() => dispatch(toggleAddNewAdminPopup())}
          className="w-full sm:w-1/3 py-3 bg-slate-300 text-black rounded-lg hover:bg-blue-400 transition"
        >
          Close
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-1/3 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default AddNewAdmin;

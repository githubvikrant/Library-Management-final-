import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, updateProfile } from "../store/slices/authSlice";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { Settings, X, Lock, Eye, EyeOff, ShieldCheck, User as UserIcon, Camera } from "lucide-react";
import userIcon from "../assets/user.png";

const PasswordField = ({ label, value, onChange, show, onToggle, placeholder }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      <Lock className="w-3.5 h-3.5" /> {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition placeholder:text-gray-400"
        required
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const SettingPopup = () => {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "security"

  // Profile State
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || userIcon);
  const fileInputRef = useRef(null);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Update effect if user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarPreview(user.avatar?.url || userIcon);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    if (avatar) {
      data.append("avatar", avatar);
    }
    dispatch(updateProfile(data));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const data = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };
    dispatch(updatePassword(data));
  };

  const passwordMatch = newPassword && confirmNewPassword && newPassword === confirmNewPassword;
  const passwordMismatch = newPassword && confirmNewPassword && newPassword !== confirmNewPassword;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Settings</h3>
              <p className="text-xs text-gray-500">Manage your account and security</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "profile" ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "security" ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Security
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === "profile" ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-100 flex items-center justify-center">
                    <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <UserIcon className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => dispatch(toggleSettingPopup())}
                  className="flex-1 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                show={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
                placeholder="Your existing password"
              />
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                onToggle={() => setShowNew(!showNew)}
                placeholder="Minimum 6 characters"
              />
              <PasswordField
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
                placeholder="Re-enter your new password"
              />

              {passwordMatch && (
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Passwords match
                </div>
              )}
              {passwordMismatch && (
                <p className="text-xs text-red-500 font-medium">⚠ Passwords do not match</p>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => dispatch(toggleSettingPopup())}
                  className="flex-1 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !!passwordMismatch}
                  className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { Settings, X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const SettingPopup = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);
    data.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(data));
  };

  const passwordMatch =
    newPassword && confirmNewPassword && newPassword === confirmNewPassword;
  const passwordMismatch =
    newPassword && confirmNewPassword && newPassword !== confirmNewPassword;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-500">Update your account credentials</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleUpdatePassword} className="px-6 py-5 space-y-4">

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
            placeholder="Minimum 8 characters"
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            show={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            placeholder="Re-enter your new password"
          />

          {/* Match indicator */}
          {passwordMatch && (
            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Passwords match
            </div>
          )}
          {passwordMismatch && (
            <p className="text-xs text-red-500 font-medium">⚠ Passwords do not match</p>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-2">
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
      </div>
    </div>
  );
};

export default SettingPopup;

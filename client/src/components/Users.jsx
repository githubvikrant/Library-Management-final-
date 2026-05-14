import { useSelector } from "react-redux";
import { Users as UsersIcon, Search, IndianRupee, AlertTriangle } from "lucide-react";
import { useState } from "react";

const FINE_PER_DAY = 10;

const calcOverdueDays = (returnDate) => {
  const now = new Date();
  const due = new Date(returnDate);
  if (due >= now) return 0;
  return Math.ceil((now - due) / (1000 * 60 * 60 * 24));
};

// Calculate total amount due for a user (book prices + fines for unreturned books)
const getUserFinancials = (user, allBorrowedBooks, books) => {
  const userBorrows = (allBorrowedBooks || []).filter(
    (b) => b.user?.email === user.email
  );
  const outstanding = userBorrows.reduce((acc, b) => {
    if (b.returnedAt) return acc;
    const book = books?.find((bk) => bk._id?.toString() === b.bookId?.toString());
    const price = book?.price || b.price || 0;
    const fine = calcOverdueDays(b.returnDate) * FINE_PER_DAY;
    return acc + price + fine;
  }, 0);
  const fines = userBorrows.reduce((acc, b) => {
    if (b.returnedAt) return acc;
    return acc + calcOverdueDays(b.returnDate) * FINE_PER_DAY;
  }, 0);
  return { outstanding, fines };
};

const Users = () => {
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours() % 12 || 12).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;

    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${formattedDate} ${formattedTime} ${ampm}`;
  };

  // Remove demo data fallback so admin sees actual registered users
  const sourceUsers = users?.filter((usr) => usr.role === "user") || [];

  const filteredUsers = sourceUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchedKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(searchedKeyword.toLowerCase())
  );

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Registered Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage library members and view their borrowing history.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow shadow-sm"
                value={searchedKeyword}
                onChange={(e) => setSearchedKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Member Info</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-center">Active Loans</th>
                    <th className="px-6 py-4 text-right">Amount Due</th>
                    <th className="px-6 py-4 text-right">Overdue Fine</th>
                    <th className="px-6 py-4">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">

                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{user.name}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                          {user.role}
                        </span>
                      </td>

                      {/* Active Loans Count */}
                      <td className="px-6 py-4 text-center">
                        {(() => {
                          const activeLoans = (allBorrowedBooks || []).filter(
                            (b) => b.user?.email === user.email && !b.returnedAt
                          ).length;
                          return (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              activeLoans > 0 ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                            }`}>
                              {activeLoans}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Per-user financials */}
                      {(() => {
                        const { outstanding, fines } = getUserFinancials(user, allBorrowedBooks, books);
                        return (
                          <>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-gray-900">₹{outstanding}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {fines > 0 ? (
                                <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600">
                                  <AlertTriangle className="w-3.5 h-3.5" />₹{fines}
                                </span>
                              ) : (
                                <span className="text-sm text-green-600 font-medium">None</span>
                              )}
                            </td>
                          </>
                        );
                      })()}

                      {/* Date */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-medium">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No members found</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                We couldn't find any registered library members matching your search.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
};

export default Users;

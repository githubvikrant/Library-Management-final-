
import { useSelector } from "react-redux";
import Header from "../layout/Header.jsx";


const Users = () => {


const {users} = useSelector((state) => state.user);

 const formatDate = (timeStamp) => {
   const date = new Date(timeStamp);
  
   const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

   const formattedTime = `${String(date.getHours()%12 ||12).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

   const ampm = date.getHours() >= 12 ? "PM" : "AM";
  
    const result = `${formattedDate} ${formattedTime} ${ampm}`;
    return result;
  };
 



  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header/>
      <header className="flex flex-col gap-3 md:flex-row md:text-2xl md:font-semibold">
        <h2>
          Registered Users
        </h2>
      </header>
      { 
        
        users && users.filter((user) => user.role === "user").length > 0 ? (
          <div className="mt-6 overflow-x-auto bg-white rounded-md shadow-lg">
             <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-400 text-gray-800">
                  <th className="px-4 py-1 text-left">Id</th>
                  <th className="px-4 py-1 text-left">Name</th>
                  <th className="px-4 py-1 text-left">Email</th>
                  <th className="px-4 py-1 text-left">Role</th>
                  <th className="px-4 py-1 text-left">Borrowed Books</th>
                  <th className="px-4 py-1 text-left">Registered At</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {users.filter((usr) => usr.role === "user").map((user,index) => (
                  <tr key={user._id} className={(index % 2 === 0 ? "bg-white":"bg-gray-200" ) + " hover:bg-gray-300"}>
                    <td className="px-4 py-1">{index+1}</td>
                    <td className="px-4 py-1">{user.name}</td>
                    <td className="px-4 py-1">{user.email}</td>
                    <td className="px-4 py-1">{user.role}</td>
                    <td className="px-4 py-1">{user.borrowedBooks.length}</td>
                    <td className="px-4 py-1">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        ): (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No registered users found.</p>
          </div>
        )
      }
    </main>
  
  </>;
};

export default Users;


const SearchedUsersList = ({ users, width, handleFunction }) => {
  if (users.length <= 0) {
    return;
  }
  return (
    <div>
      <div
        className={`mt-1 ${
          width === "full"
            ? "w-full bg-transparent text-white"
            : "w-fit bg-white "
        } p-2 flex flex-col gap-3 rounded-xl shadow-xs overflow-y-auto `}
      >
        {users.map((user, i) => {
          return (
            <div
              className="flex items-center gap-3 px-2 py-1 hover:bg-camel-700/30 rounded-xl cursor-pointer"
              key={i}
              onClick={() => handleFunction(user)}
            >
              <div className="flex items-center ">
                <img
                  src={user?.displayPicture}
                  alt="user-dp"
                  className="object-cover w-7 h-7 rounded-full"
                />
              </div>
              <div>
                <div className="text-md font-bold">{user.name}</div>
                <div className="text-xs">{user.email}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchedUsersList;

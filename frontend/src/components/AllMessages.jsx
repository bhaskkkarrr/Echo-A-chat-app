import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AllMessages = ({ messages }) => {
  const { user } = useContext(AuthContext);

  if (!messages) return null;

  // Reverse once safely
  const reversedMessages = [...messages].reverse();

  return (
    <div className="h-full bg-thistle-100 overflow-y-auto px-2 md:px-5 flex flex-col-reverse">
      {/* Messages wrapper */}
      <div className="flex flex-col-reverse gap-1 py-3">
        {reversedMessages.map((message, index) => {
          const isMine = message.sender._id === user._id;

          const ts = message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          const prevMessage = reversedMessages[index - 1];

          const sameMinute =
            prevMessage &&
            new Date(prevMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) === ts;

          const showTime = !prevMessage || !sameMinute;

          return (
            <div
              key={message._id || index}
              className={`flex items-end gap-2 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar for other user */}
              {!isMine && message.sender?.displayPicture && (
                <img
                  src={message.sender.displayPicture}
                  alt="dp"
                  className="w-7 h-7 rounded-full object-cover mb-4 hidden sm:block"
                />
              )}

              <div className="max-w-[75%] md:max-w-[60%]">
                {/* Message bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm md:text-[15px] break-words shadow ${
                    isMine
                      ? "bg-baby-pink-300 text-white rounded-br-md"
                      : "bg-white text-black rounded-bl-md"
                  }`}
                >
                  {message.content}
                </div>

                {/* Timestamp */}
                {showTime && (
                  <div
                    className={`text-[10px] mt-1 px-1 ${
                      isMine ? "text-end" : "text-start"
                    } text-gray-500`}
                  >
                    {ts}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllMessages;

export const getSender = (loggedUser, users) => {
  // if (!loggedUser || !users || users.length < 2) return null;
  const sender =
    users[0]?._id === loggedUser._id ? users[1].name : users[0].name;
  return sender || null;
};
export const getSenderFull = (loggedUser, users) => {
  // if (!loggedUser || !users || users.length < 2) return null;
  const sender = users[0]._id === loggedUser._id ? users[1] : users[0];
  return sender || null;
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

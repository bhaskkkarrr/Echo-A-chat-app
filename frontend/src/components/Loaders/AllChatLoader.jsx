const AllChatLoader = ({ count = 7 }) => {
  return (
    <div className="">
      {[...Array(count)].map((_, i) => {
        return (
          <div className="flex items-center gap-3 p-4 animate-pulse" key={i}>
            {/* Avatar Skeleton */}
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-100 to-gray-50 shrink-0"></div>

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-linear-to-r from-gray-100 to-gray-50 rounded w-1/3"></div>
              </div>
              <div className="h-3 bg-linear-to-r from-gray-100 to-gray-50  rounded w-2/3"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllChatLoader;

const SearchLoader = ({ count = 4, width }) => {
  return (
    <div
      className={`flex flex-col gap-3   rounded-xl shadow-xs ${
        width === "fit" ? "w-fit bg-white" : "w-full"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} role="status" className="ml-3 p-3  ">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 bg-camel-200 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="h-2.5 bg-camel-200 rounded-full w-24" />
              <div className="h-2 bg-camel-200 rounded-full w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SearchLoader;

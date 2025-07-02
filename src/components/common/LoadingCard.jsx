const LoadingCard = ({ rows = 6 }) => {
  return (
    <div className="grid gap-4 md:gap-6">
      {[...Array(rows)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-200 rounded"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded-lg w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingCard;
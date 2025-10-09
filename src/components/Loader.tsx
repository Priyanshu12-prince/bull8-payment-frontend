import { useEffect, useState } from "react";

const Loader = () => {
  const [progress, setProgress] = useState(0);

  // Simulate progress increment
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Spinner in center */}
      <div className="w-16 h-16 mb-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin shadow-lg"></div>

      {/* Horizontal progress line */}
      <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress text */}
      <div className="mt-2 text-gray-700 font-medium flex items-center gap-2">
        <svg
          className="w-5 h-5 text-green-500 animate-pulse"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {progress < 100 ? `${progress}% Secure` : "Transaction Complete"}
      </div>
    </div>
  );
};

export default Loader;

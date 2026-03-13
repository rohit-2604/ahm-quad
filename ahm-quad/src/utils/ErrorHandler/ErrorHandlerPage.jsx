import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AlertTriangle, RefreshCcw } from "lucide-react";

const ErrorHandlerPage = ({ error }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-red-600 to-red-400 text-white p-6"
    >
      <div className="flex flex-col items-center bg-white shadow-xl rounded-2xl p-8 text-red-700 max-w-md w-full text-center">
        <AlertTriangle size={50} className="text-red-600 mb-4" />
        <h1 className="text-2xl font-semibold">Oops! Something went wrong.</h1>
        <p className="mt-2 text-sm">Please try refreshing the page.</p>
        <p className="mt-1 text-sm">If the issue persists, contact support.</p>
        {error && <p className="mt-4 text-xs bg-red-100 p-2 rounded-lg">Error: {error.message}</p>}
        <button
          className="mt-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>
    </div>
  );
};

export default ErrorHandlerPage;
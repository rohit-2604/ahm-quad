import React from 'react'

const NotificationBox = ({ message, isCritical, onView }) => {
  return (
    <div className={`w-full p-4 border-b border-gray-100 hover:bg-gradient-to-r transition-all duration-300 cursor-pointer group ${
      isCritical 
        ? 'hover:from-red-50 hover:to-transparent bg-red-50/30' 
        : 'hover:from-blue-50 hover:to-transparent'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon Container */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCritical 
            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200'
        }`}>
          {isCritical ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-relaxed line-clamp-2 mb-1.5">{message}</p>
          {isCritical && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              Critical
            </span>
          )}
        </div>
        
        {/* View Button */}
        <button
          onClick={onView}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
            isCritical
              ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md group-hover:scale-105'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md group-hover:scale-105'
          }`}
        >
          View
        </button>
      </div>
    </div>
  )
}
export default NotificationBox
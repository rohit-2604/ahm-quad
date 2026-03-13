import React from 'react'
import NotificationBox from './NotificationBox'

const NotificationOverview = () => {
    const notifications = [
    {
      id: 1,
      message: "Your account password will expire in 3 days",
      isCritical: true
    },
    {
      id: 2,
      message: "New comment on your post: 'Great work on the project!'",
      isCritical: false
    },
    {
      id: 3,
      message: "System maintenance scheduled for tonight at 2 AM",
      isCritical: false
    },
    {
      id: 4,
      message: "Payment failed - Please update your billing information",
      isCritical: true
    }
  ];
  return (
    <div className='w-[500px] bg-white z-[50] flex gap-2 justify-center items-center shadow-xl rounded-md flex-col p-2 px-4 pt-4 animate-slide-in-up'>
        
        <div className="flex w-full justify-start items-center font-semibold text-lg">Notifications</div>
         <div className="max-h-[250px] overflow-y-auto w-full animate-slide-in">
            {notifications.map((notification,index) => (
               <div 
              key={notification.id}
              className="animate-slide-in"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
              }}
            >
              <NotificationBox
                key={notification.id}
                message={notification.message}
                isCritical={notification.isCritical}
                onView={() => handleView(notification.id)}
              />
            </div>
            ))}
          </div>
    <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.2s ease-out;
        }
           @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
export default NotificationOverview
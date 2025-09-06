import React, { useState, useEffect } from 'react';
import { FaTimes, FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { useWebSocket } from '../../contexts/WebSocketContext';

const NotificationToast = ({ className = '' }) => {
  const { notifications, removeNotification } = useWebSocket();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setVisibleNotifications(prev => [...prev, latestNotification]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setVisibleNotifications(prev => 
          prev.filter(n => n.id !== latestNotification.id)
        );
        removeNotification(latestNotification.id);
      }, 5000);
    }
  }, [notifications, removeNotification]);

  const handleClose = (notificationId) => {
    setVisibleNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
    removeNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_post':
        return <FaInfoCircle className="h-5 w-5 text-blue-500" />;
      case 'new_comment':
        return <FaCheckCircle className="h-5 w-5 text-green-500" />;
      case 'new_doubt':
        return <FaExclamationCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <FaBell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_post':
        return 'border-blue-200 bg-blue-50';
      case 'new_comment':
        return 'border-green-200 bg-green-50';
      case 'new_doubt':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 transform translate-x-0 ${
            getNotificationColor(notification.type)
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            
            <button
              onClick={() => handleClose(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;


import React, { createContext, useState, useContext, ReactNode } from "react";
import Notification from "../components/utils/Notification";

interface Notification {
  id: number;
  type: "success" | "error";
  message: string;
}

interface NotificationContextProps {
  addNotification: (type: "success" | "error", message: string) => void;
  removeNotification: (id: number) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: "success" | "error", message: string) => {
    setNotifications((prev) => [ { id: Date.now(), type, message },...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
      {children}
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        //   isOpen={true}
          autoCloseDuration={5000}
          top={20 + index * 80} 
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationProvider;

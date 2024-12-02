import { faCheckCircle, faClose, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  autoCloseDuration?: number;
  top: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  top,
  autoCloseDuration = 5000,
}) => {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval:NodeJS.Timeout;

    const updateProgress = () => {
      const currentTime = Date.now();
      const newElapsed = paused ? elapsed : currentTime - startTime;
      const newProgress = Math.min((newElapsed / autoCloseDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        onClose();
      } else {
        setElapsed(newElapsed);
      }
    };

    const startInterval = () => {
      interval = setInterval(updateProgress, 80);
    };

    // Start interval and handle cleanup
    startInterval();
    return () => clearInterval(interval);
  }, [startTime, elapsed, paused, autoCloseDuration, onClose]);

  // Restart timer when paused state changes
  useEffect(() => {
    if (!paused) {
      setStartTime(Date.now() - elapsed);  
    }
  }, [paused]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Conditional styles
  const backgroundColor = type === "error" ? "bg-red-100" : "bg-green-100";
  const textColor = type === "error" ? "text-red-500" : "text-green-500";
  const icon = type === "error" ? faExclamationCircle : faCheckCircle;

  return ReactDOM.createPortal(
    <div
      className={`fixed right-4 z-50 ${backgroundColor} ${textColor} shadow-lg`}
      style={{ top: `${top}px`, width: "300px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center p-4 rounded-lg">
        <FontAwesomeIcon icon={icon} className="mr-2 text-lg" />
        <span className="flex-grow text-sm">{message}</span>
        <button onClick={onClose} aria-label="Close notification" className="ml-2">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <div className="h-1 bg-gray-300">
        <div
          style={{ width: `${progress}%` }}
          className="bg-black h-full transition-all duration-300"
        />
      </div>
    </div>,
    document.body
  );
};

export default Notification;

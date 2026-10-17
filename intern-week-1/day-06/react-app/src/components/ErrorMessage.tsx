import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-banner" role="alert">
      <div className="error-content">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <h4>Connection Error</h4>
          <p>{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRetry}
          style={{ borderColor: "var(--danger-border)", flexShrink: 0 }}
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

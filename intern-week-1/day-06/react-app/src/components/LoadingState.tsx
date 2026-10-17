import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading employee records from REST API..."
}) => {
  return (
    <div className="loading-box" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{message}</p>
    </div>
  );
};

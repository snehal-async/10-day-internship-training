"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js App Router Error:", error);
  }, [error]);

  return (
    <div className="error-banner" style={{ flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
      <div>
        <h4 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Connection or Processing Error</h4>
        <p style={{ marginTop: "0.25rem" }}>{error.message || "An unexpected error occurred while communicating with the backend."}</p>
      </div>
      <button type="button" className="btn btn-secondary" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
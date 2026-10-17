export default function Loading() {
  return (
    <div className="loading-box" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>
        Loading data from Express backend...
      </p>
    </div>
  );
}
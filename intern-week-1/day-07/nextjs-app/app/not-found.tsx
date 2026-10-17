import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
      <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "var(--primary-600)" }}>404</h2>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>Page or Record Not Found</h3>
      <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", maxWidth: 450, margin: "0.5rem auto 1.5rem" }}>
        The employee record or page you requested does not exist or may have been removed.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "StaffHub Enterprise | Next.js 14 Employee Dashboard",
  description: "Next.js App Router + TypeScript frontend communicating with Express REST API (Day 07)"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">{children}</main>
          <footer className="footer">
            <p>
              StaffHub Enterprise • 10-Day Intern Technical Training Program • Day 07 (Next.js 14 App Router + Node.js/Express REST API)
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
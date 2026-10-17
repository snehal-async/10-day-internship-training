"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../lib/api";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [apiOnline, setApiOnline] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    api
      .checkHealth()
      .then(() => {
        if (mounted) setApiOnline(true);
      })
      .catch(() => {
        if (mounted) setApiOnline(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="brand-titles">
              <h1>StaffHub Enterprise</h1>
              <p>Next.js 14 + Express REST API (Day 07)</p>
            </div>
          </Link>
        </div>

        <nav className="nav-links" aria-label="Main Navigation">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link href="/employees" className={`nav-link ${pathname.startsWith("/employees") && !pathname.includes("/create") ? "active" : ""}`}>
            Directory
          </Link>
          <Link href="/employees/create" className={`nav-link ${pathname === "/employees/create" ? "active" : ""}`}>
            + Add Employee
          </Link>
        </nav>

        <div className="navbar-actions">
          <div className="api-pill" title="Express backend status on port 4000">
            <span
              className="pulse-dot"
              style={{ backgroundColor: apiOnline ? "var(--success-accent)" : "var(--danger-accent)" }}
            ></span>
            <span>Express API {apiOnline ? "Online (4000)" : "Offline"}</span>
          </div>

          <Link href="/employees/create" className="btn btn-primary" id="btn-navbar-add">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Employee</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
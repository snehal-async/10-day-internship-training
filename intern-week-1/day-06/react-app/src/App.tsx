import React, { useState, useCallback } from "react";
import { ToastMessage } from "./types/api";
import { Navbar } from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { ToastNotification } from "./components/ToastNotification";

export const App: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toastData: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, ...toastData };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after duration (defaults to 4000ms)
    const duration = toastData.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        onAddClick={() => {
          const addBtn = document.getElementById("btn-add-employee-hero");
          if (addBtn) addBtn.click();
        }}
        activeCount={22}
      />

      {/* Main Composite Dashboard */}
      <DashboardPage onAddToast={addToast} />

      {/* Footer */}
      <footer className="footer">
        <p>
          StaffHub Enterprise Dashboard &copy; {new Date().getFullYear()} • 10-Day Intern Technical Training Program • Day 06 (TypeScript + React)
        </p>
      </footer>

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;

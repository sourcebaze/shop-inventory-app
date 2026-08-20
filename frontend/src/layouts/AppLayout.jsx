import { useState } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import Toast from "../components/common/Toast.jsx";
export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 sm:p-6 max-w-[1600px] mx-auto min-w-0">
          {children}
        </main>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

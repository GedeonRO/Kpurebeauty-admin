import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-h-screen lg:pl-64 "
       
      >
        {/* 👆 marge à gauche = largeur du sidebar */}

        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto " style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

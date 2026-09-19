import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "@/components/SideNav";
import MobileHeader from "@/components/MobileHeader";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <SideNav />
      <MobileHeader />
      <main className="md:pl-60 min-h-screen">
        <div className="px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
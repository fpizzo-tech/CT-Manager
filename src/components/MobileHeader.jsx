import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Network,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alunos", label: "Alunos", icon: Users },
  { to: "/instrutores", label: "Instrutores", icon: GraduationCap },
  { to: "/cursos", label: "Cursos", icon: BookOpen },
  { to: "/empresas", label: "Empresas", icon: Building2 },
  { to: "/relacionamentos", label: "Relacionamentos", icon: Network },
];

export default function MobileHeader() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!isMobile) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-border">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-foreground">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-xs">
            CT
          </div>
          <span className="font-heading font-bold text-sm">CT Manager</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
          {(user?.full_name || user?.email || "U").charAt(0)}
        </div>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-72 max-w-[80%] bg-sidebar text-sidebar-foreground flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-heading font-bold text-sm">
                  CT
                </div>
                <span className="font-heading font-bold text-white">CT Manager</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-sidebar-foreground/70 p-1">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-sidebar-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Network,
  CalendarDays,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alunos", label: "Alunos", icon: Users },
  { to: "/instrutores", label: "Instrutores", icon: GraduationCap },
  { to: "/cursos", label: "Cursos", icon: BookOpen },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/empresas", label: "Empresas", icon: Building2 },
  { to: "/relacionamentos", label: "Relacionamentos", icon: Network },
];

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-heading font-bold text-lg">
          CT
        </div>
        <div className="leading-tight">
          <div className="font-heading font-bold text-white text-base">CT Manager</div>
          <div className="text-[11px] text-sidebar-foreground/60">Centro de Treinamento</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
              )}
            >
              <item.icon className="h-4.5 w-4.5" size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-medium">
          <ShieldCheck size={14} />
          Sistema Online
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold uppercase">
            {(user?.full_name || user?.email || "U").charAt(0)}
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <div className="text-xs font-semibold text-white truncate">
              {user?.full_name || "Usuário"}
            </div>
            <div className="text-[11px] text-sidebar-foreground/50 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sidebar-foreground/60 hover:text-white transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
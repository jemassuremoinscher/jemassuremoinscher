import { NavLink } from "react-router-dom";
import {
  KanbanSquare, Users, FileText, BarChart3, Wallet, Megaphone,
  Shield, Trash2, Settings, Upload, Bell, Briefcase,
} from "lucide-react";
import arthurLogo from "@/assets/mascotte/arthur-thumbs-up.webp";

interface Item {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  end?: boolean;
}

const items: Item[] = [
  { to: "/admin", label: "Pipeline", icon: KanbanSquare, end: true },
  { to: "/admin/portefeuille", label: "Portefeuille", icon: Briefcase },
  { to: "/admin/contacts", label: "Contacts", icon: Users },
  { to: "/admin/documents", label: "GED", icon: FileText },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/import", label: "Import CSV", icon: Upload, adminOnly: true },
  { to: "/admin/dashboard", label: "Dashboard", icon: BarChart3, adminOnly: true },
  { to: "/admin/finance", label: "Finance", icon: Wallet, adminOnly: true },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone, adminOnly: true },
  { to: "/admin/rgpd", label: "RGPD", icon: Shield, adminOnly: true },
  { to: "/admin/trash", label: "Corbeille", icon: Trash2, adminOnly: true },
  { to: "/admin/reglages/notifications", label: "Réglages notif.", icon: Settings },
];

export function CrmSidebar({ isAdmin }: { isAdmin: boolean }) {
  const visible = items.filter((i) => !i.adminOnly || isAdmin);
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-1 border-r border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 py-4">
      <div className="flex items-center gap-2.5 px-3 pb-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#7C3AED] ring-2 ring-[#F3E8FF] dark:ring-[#362B54]">
          <img
            src={arthurLogo}
            alt="Arthur"
            className="h-10 w-10 object-cover object-top"
          />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
            jemassuremoinscher.fr
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">CRM Assurance</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {visible.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F3E8FF] dark:bg-[#262140] text-[#5B21B6] dark:text-[#D8B4FE]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-[#FAF5FF] dark:hover:bg-[#262140] hover:text-[#5B21B6] dark:hover:text-[#D8B4FE]",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-4">
        <NavLink
          to="/admin/legacy"
          className="flex items-center gap-3 rounded-full px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#262140]"
        >
          <Settings className="h-3.5 w-3.5" />
          Ancien admin
        </NavLink>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { LayoutDashboard, Users, FileText, ClipboardList } from "lucide-react";

export default function ManagerSidebar() {
  const pathname = globalThis.location?.pathname || "";

  return (
    <aside className="bg-white shadow-md w-64 p-6 border-l text-right h-full">
      <nav className="space-y-2">
        <SidebarLink
          href="/manager/dashboard"
          icon={<LayoutDashboard size={24} />}
          label="الرئيسية"
          active={pathname === "/manager/dashboard"}
        />
        <SidebarLink
          href="/manager/employees"
          icon={<Users size={24} />}
          label="موظفو القسم"
          active={pathname === "/manager/employees"}
        />
        <SidebarLink
          href="/manager/requests"
          icon={<FileText size={24} />}
          label="طلبات القسم"
          active={pathname === "/manager/requests"}
        />
        <SidebarLink
          href="/manager/surveys"
          icon={<ClipboardList size={24} />}
          label="الاستبيانات"
          active={pathname.startsWith("/manager/surveys")}
        />
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200
        text-gray-700 hover:text-blue-600 hover:bg-blue-50
        ${active ? "bg-blue-100 text-blue-700" : ""}
      `}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

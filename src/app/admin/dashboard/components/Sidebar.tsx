"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  BookOpen,
  Settings,
} from "lucide-react";
import { RiSurveyFill } from "react-icons/ri";

export default function Sidebar() {
  return (
    <aside className="h-full bg-white shadow-md px-4 py-6 flex flex-col border-l text-right">
      {/* العنوان */}
      <h2 className="text-xl font-extrabold text-blue-600 mb-8 text-center tracking-tight">
        لوحة التحكم
      </h2>

      {/* روابط التنقل */}
      <nav className="space-y-2">
        <SidebarLink
          href="/admin/dashboard"
          icon={<LayoutDashboard size={20} />}
        >
          الرئيسية
        </SidebarLink>
        <SidebarLink href="/admin/employees" icon={<Users size={20} />}>
          الموظفون
        </SidebarLink>
        <SidebarLink href="/admin/departments" icon={<Building2 size={20} />}>
          الأقسام
        </SidebarLink>
        <SidebarLink href="/admin/requests" icon={<FileText size={20} />}>
          الطلبات
        </SidebarLink>
        <SidebarLink href="/admin/courses" icon={<BookOpen size={20} />}>
          الدورات
        </SidebarLink>
        <SidebarLink href="/admin/surveys" icon={<RiSurveyFill size={20} />}>
          الاستبيانات
        </SidebarLink>
        <SidebarLink href="/admin/settings" icon={<Settings size={20} />}>
          الإعدادات
        </SidebarLink>
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex justify-between items-center px-3 py-2 rounded-lg transition-all text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium text-sm"
    >
      <span>{children}</span>
      {icon}
    </Link>
  );
}

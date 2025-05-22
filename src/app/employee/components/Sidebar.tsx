import Link from "next/link";
import {
  BsHouseDoorFill,
  BsCalendarCheck,
  BsPencilSquare,
  BsBarChartFill,
  BsBookmarkCheck,
  BsFileEarmarkText,
} from "react-icons/bs";

export default function Sidebar() {
  return (
    <aside className="bg-white shadow-md w-64 p-6 border-r hidden md:block text-right">
      <nav className="space-y-2">
        <SidebarLink
          href="/employee/dashboard"
          icon={<BsHouseDoorFill />}
          label="لوحة التحكم"
        />
        <SidebarLink
          href="/employee/requests/my"
          icon={<BsCalendarCheck />}
          label="طلباتي السابقة"
        />
        <SidebarLink
          href="/employee/personal-update"
          icon={<BsPencilSquare />}
          label="تحديث بياناتي"
        />
        <SidebarLink
          href="/employee/requests/course-request/new"
          icon={<BsBookmarkCheck />}
          label="الدورات التدريبية"
        />
        <SidebarLink
          href="/employee/surveys"
          icon={<BsBarChartFill />}
          label="الاستبيانات"
        />
        <SidebarLink
          href="/employee/requests"
          icon={<BsFileEarmarkText />}
          label="الطلبات الرسمية"
        />
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 
        transition-colors duration-200 font-medium
      "
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

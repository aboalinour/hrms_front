"use client";

// import Navbar from '@/app/employee/components/Navbar';
// import Sidebar from '@/app/employee/components/Sidebar';
// import Footer from '@/app/employee/components/Footer';
import Link from "next/link";
import {
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
} from "react-icons/hi";

const requestTypes = [
  {
    title: "طلب إجازة",
    icon: <HiOutlineClipboardList className="text-4xl text-blue-600" />,
    href: "/employee/requests/leave/create",
  },
  {
    title: "طلب بيان وضع",
    icon: <HiOutlineDocumentText className="text-4xl text-indigo-600" />,
    href: "/employee/requests/statement-request/new?type=status",
  },
  {
    title: "طلب بيان مالي",
    icon: <HiOutlineBriefcase className="text-4xl text-emerald-600" />,
    href: "/employee/requests/statement-request/new?type=salary",
  },
  {
    title: "طلب تسجيل دورة",
    icon: <HiOutlineAcademicCap className="text-4xl text-purple-600" />,
    href: "/employee/requests/course-request/new",
  },
];

export default function RequestsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex flex-1">
        {/* <Sidebar /> */}

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">تقديم طلب</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {requestTypes.map(({ title, icon, href }) => (
              <Link key={href} href={href}>
                <div className="bg-white p-6 rounded-xl shadow-md text-center hover:bg-blue-50 transition cursor-pointer">
                  <div className="mb-4 flex justify-center">{icon}</div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}


// src/app/hr/layout.tsx
'use client';

import HrSidebar from './dashboard/components/Sidebar';
import HrNavbar from './dashboard/components/Navbar';
import HrFooter from './dashboard/components/Footer';

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ✅ الشريط الجانبي */}
      <div className="w-64">
        <HrSidebar />
      </div>

      {/* ✅ المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* ✅ الناف بار */}
        <HrNavbar />

        {/* ✅ الصفحة */}
        <main className="flex-1 p-6">{children}</main>

        {/* ✅ الفوتر */}
        <HrFooter />
      </div>
    </div>
  );
}

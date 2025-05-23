// src/app/admin/page.tsx
"use client";

import AdminDashboardLayout from "./components/layout";
import Sidebar from "./dashboard/components/Sidebar";
import Navbar from "./dashboard/components/Navbar";
import Footer from "./dashboard/components/Footer";

export default function AdminHomePage() {
  return (
    <AdminDashboardLayout
      sidebar={<Sidebar />}
      navbar={<Navbar />}
      footer={<Footer />}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">لوحة تحكم الأدمن</h1>
        <p>مرحبًا بك في النظام.</p>
      </div>
    </AdminDashboardLayout>
  );
}

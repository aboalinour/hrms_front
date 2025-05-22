// src/app/admin/layout.tsx

import AdminDashboardLayout from "./components/layout";
import Sidebar from "./dashboard/components/Sidebar";
import Navbar from "./dashboard/components/Navbar";
import Footer from "./dashboard/components/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDashboardLayout
      sidebar={<Sidebar />}
      navbar={<Navbar />}
      footer={<Footer />}
    >
      {children}
    </AdminDashboardLayout>
  );
}

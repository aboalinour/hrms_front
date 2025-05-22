import AdminDashboardLayout from "../admin/components/layout";
import ManagerSidebar from "./components/Sidebar";
import ManagerNavbar from "./components/Navbar";
import ManagerFooter from "./components/Footer";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDashboardLayout
      sidebar={<ManagerSidebar />} // ✅ JSX فقط
      navbar={<ManagerNavbar />}
      footer={<ManagerFooter />}
    >
      {children}
    </AdminDashboardLayout>
  );
}

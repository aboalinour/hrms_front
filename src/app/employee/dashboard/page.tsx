"use client";

// import Navbar from "@/app/employee/components/Navbar";
// import Sidebar from "@/app/employee/components/Sidebar";
// import Footer from "@/app/employee/components/Footer";

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Navbar /> */}

      <div className="flex flex-1">
        {/* <Sidebar /> */}

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="تقديم طلب"
              icon="➕"
              href="/employee/requests"
            />
            <DashboardCard
              title="تحديث بياناتي"
              icon="📝"
              href="/employee/personal-update"
            />
            <DashboardCard
              title="الدورات التدريبية"
              icon="🎓"
              href="/employee/courses"
            />
            <DashboardCard
              title="الاستبيانات"
              icon="📊"
              href="/employee/surveys"
            />
            <DashboardCard
              title="طلباتي السابقة"
              icon="🗂️"
              href="/employee/requests/my"
            />
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

function DashboardCard({
  title,
  icon,
  href,
}: {
  title: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-50 transition"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </a>
  );
}

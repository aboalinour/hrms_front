"use client";

import { useEffect, useState } from "react";
import { Users, FileText, BarChart } from "lucide-react";
import RequestsOverview from "@/app/admin/dashboard/components/RequestsOverview";
import LatestRequests from "@/app/admin/dashboard/components/LatestRequests";
import RecentActivities from "@/app/admin/dashboard/components/RecentActivities";

interface User {
  id: number;
  name: string;
  roles: string;
  departmentId?: number;
  department?: string;
}

export default function ManagerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col p-6">
        {/* <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">لوحة تحكم المدير</h2>
          {user && (
            <p className="text-gray-600 mt-1 text-lg">
              قسم:{" "}
              <span className="font-semibold text-gray-700">
                {user.department}
              </span>
            </p>
          )}
        </header> */}

        {/* بطاقات موجزة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="موظفو قسمي" icon={<Users size={28} />} value="25" />
          <StatCard
            title="طلبات قسمي"
            icon={<FileText size={28} />}
            value="7"
          />
          <StatCard
            title="نسبة نشاط القسم"
            icon={<BarChart size={28} />}
            value="80%"
          />
        </div>

        {/* نظرة عامة وبيانات إضافية */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 flex-1">
          <div className="lg:col-span-2 space-y-6">
            <RequestsOverview />
            <LatestRequests />
          </div>

          <div className="space-y-6">
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard مكرر داخل نفس الملف (يمكن نقله إلى ملف منفصل حسب حاجتك)
function StatCard({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-green-50 transition">
      <div className="flex justify-center mb-3 text-green-600">{icon}</div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

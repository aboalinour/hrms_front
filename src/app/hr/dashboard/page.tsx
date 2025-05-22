"use client";

import { Users, FileText, LayoutDashboard, BarChart } from "lucide-react";

import DashboardCard from "./components/DashboardCard";
import RequestsOverview from "./components/RequestsOverview";
import LatestRequests from "./components/LatestRequests";
import RecentActivities from "./components/RecentActivities";
import CoursesCount from "./components/CoursesCount";

export default function HrDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex">
        {/* يمكن إضافة Sidebar خاص بصفحة الموارد البشرية لاحقًا */}

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">الرئيسية</h2>

          {/* ✅ بطاقات موجزة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="عدد الموظفين"
              icon={<Users size={28} />}
              value="120"
            />
            <StatCard
              title="الموظفون النشطون"
              icon={<BarChart size={28} />}
              value="60%"
            />
            <StatCard
              title="عدد الأقسام"
              icon={<LayoutDashboard size={28} />}
              value="5"
            />
            <StatCard
              title="طلبات قيد المراجعة"
              icon={<FileText size={28} />}
              value="12"
            />
          </div>

          {/* ✅ نظرة عامة وبيانات إضافية */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <RequestsOverview />
              <LatestRequests />
            </div>

            <div className="space-y-6">
              <CoursesCount />
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ بطاقة موحدة تتناسق مع AdminDashboardPage
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
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-50 transition">
      <div className="flex justify-center mb-3 text-blue-600">{icon}</div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

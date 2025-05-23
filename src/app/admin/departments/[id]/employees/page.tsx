'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Employee {
  id: number;
  name: string;
  email: string;
  job_number: string;
  department: string;
  roles: string[]; // قائمة أسماء الأدوار
}

export default function DepartmentEmployeesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get<{ data: Employee[] }>(
          `/departments/${id}/employees`
        );
        const employeesData = res.data.data;
        setEmployees(employeesData);
        if (employeesData.length > 0) {
          setDepartmentName(employeesData[0].department || null);
        }
      } catch (err) {
        console.error(err);
        setError("فشل في تحميل الموظفين");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [id]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* 🔙 زر الرجوع */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/admin/departments`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة لقائمة الأقسام
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          موظفو القسم {departmentName ? `«${departmentName}»` : `رقم ${id}`}
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-500">جارٍ التحميل...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">لا يوجد موظفون في هذا القسم</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg text-right text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-3 border-b">الاسم</th>
              <th className="px-6 py-3 border-b">البريد الإلكتروني</th>
              <th className="px-6 py-3 border-b">الرقم الوظيفي</th>
              <th className="px-6 py-3 border-b">الأدوار</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition border-b">
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.job_number || "-"}</td>
                <td className="px-6 py-4">
                  {emp.roles.length > 0 ? emp.roles.join(", ") : "بدون دور"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Department {
  id: number;
  name: string;
  manager: string | null;
}

export default function DepartmentTable() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get<{ data: Department[] }>("/departments");
        setDepartments(response.data.data);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleEdit = (id: number) =>
    router.push(`/hr/departments/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    } catch (err) {
      console.error(err);
      alert("فشل في حذف القسم");
    }
  };

  const handleAdd = () => {
    router.push("/hr/departments/create");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">قائمة الأقسام</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          + إضافة قسم
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg text-right text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3 border-b">اسم القسم</th>
                <th className="px-6 py-3 border-b">المدير</th>
                <th className="px-6 py-3 border-b">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-gray-50 transition border-b"
                  >
                    <td className="px-6 py-4">{dept.name}</td>
                    <td className="px-6 py-4">
                      {dept.manager ?? "لا يوجد مدير"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-row-reverse gap-4">
                        <button
                          onClick={() => handleEdit(dept.id)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-500 py-6 font-medium"
                  >
                    لا توجد بيانات لعرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

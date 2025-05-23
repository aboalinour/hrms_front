'use client';
export const dynamic = 'force-dynamic';

import useSWR from "swr";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Department {
  id: number;
  name: string;
  manager: string | null;
}

const fetcher = (url: string) =>
  api.get<{ data: Department[] }>(url).then((res) => res.data.data);

export default function DepartmentTable() {
  const router = useRouter();

  const {
    data: departments = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Department[]>("/departments", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const handleEdit = (id: number) => router.push(`/admin/departments/edit/${id}`);
  const handleAdd = () => router.push("/admin/departments/create");

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    try {
      await api.delete(`/departments/${id}`);
      mutate(); // إعادة تحميل البيانات بعد الحذف
    } catch (err) {
      console.error(err);
      alert("فشل في حذف القسم");
    }
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

      {isLoading ? (
        <p className="text-center text-gray-500">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-center text-red-500">فشل في جلب البيانات</p>
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
                  <tr key={dept.id} className="hover:bg-gray-50 transition border-b">
                    <td className="px-6 py-4">{dept.name}</td>
                    <td className="px-6 py-4">{dept.manager ?? "لا يوجد مدير"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-row-reverse gap-4">
                        <button
                          onClick={() =>
                            router.push(`/admin/departments/${dept.id}/employees`)
                          }
                          className="text-green-600 hover:underline font-medium"
                        >
                          عرض الموظفين
                        </button>
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
                  <td colSpan={3} className="text-center text-gray-500 py-6 font-medium">
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

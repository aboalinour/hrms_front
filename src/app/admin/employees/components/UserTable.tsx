"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  department: string | null;
  roles: string[];
  status: "active" | "suspended" | "resigned";
}

const STATUS_MAP: Record<User["status"], { label: string; classes: string }> = {
  active: { label: "نشط", classes: "bg-green-100 text-green-700" },
  suspended: { label: "معلق", classes: "bg-yellow-100 text-yellow-700" },
  resigned: { label: "مستقيل", classes: "bg-red-100 text-red-700" },
};

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function UserTable() {
  const router = useRouter();

  const { data: users = [], error, isLoading, mutate } = useSWR<User[]>("/user", fetcher, {
    revalidateOnFocus: false, // لمنع إعادة الطلب عند العودة للصفحة
  });

  const handleAdd = () => router.push("/admin/employees/create");
  const handleEdit = (id: number) => router.push(`/admin/employees/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      await api.delete(`/user/${id}`);
      mutate(); // إعادة تحميل البيانات تلقائيًا بعد الحذف
    } catch (err) {
      console.error(err);
      alert("فشل في حذف المستخدم");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + إضافة موظف
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">جارٍ تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center text-red-500">فشل في جلب البيانات</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">البريد الإلكتروني</th>
                <th className="px-4 py-3">القسم</th>
                <th className="px-4 py-3">الأدوار</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 divide-y">
              {users.length > 0 ? (
                users.map((user) => {
                  const { label, classes } = STATUS_MAP[user.status];
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.department || "—"}</td>
                      <td className="px-4 py-3">{user.roles.join(", ")}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${classes}`}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="text-blue-600 hover:underline"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:underline"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-6">
                    لا توجد بيانات لعرضها.
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

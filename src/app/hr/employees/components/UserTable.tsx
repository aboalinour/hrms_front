"use client";

import { useEffect, useState } from "react";
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

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

const STATUS_MAP: Record<User["status"], { label: string; classes: string }> = {
  active: { label: "نشط", classes: "bg-green-100 text-green-700" },
  suspended: { label: "معلق", classes: "bg-yellow-100 text-yellow-700" },
  resigned: { label: "مستقيل", classes: "bg-red-100 text-red-700" },
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [links, setLinks] = useState<PaginationLinks | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get<{
          data: User[];
          meta: PaginationMeta;
          links: PaginationLinks;
        }>(`/user?per_page=15&page=${page}`);

        setUsers(response.data.data);
        setMeta(response.data.meta);
        setLinks(response.data.links);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handleAdd = () => router.push("/hr/employees/create");
  const handleEdit = (id: number) => router.push(`/hr/employees/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("فشل في حذف المستخدم");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* العنوان وزر الإضافة */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + إضافة موظف
        </button>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          إدارة الموظفين
        </h1>
      </div>

      {/* تحميل أو خطأ */}
      {loading ? (
        <div className="text-center text-gray-500">جارٍ تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
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
                    const isAdminOrHR =
                      user.roles.includes("admin") || user.roles.includes("hr");

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
                          {!isAdminOrHR && (
                            <>
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
                            </>
                          )}
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

          {/* أزرار Pagination */}
          {meta && (
            <div className="flex justify-center space-x-2 rtl:space-x-reverse mt-4">
              <button
                disabled={!links?.prev}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                السابق
              </button>

              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      pageNum === page ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                disabled={!links?.next}
                onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

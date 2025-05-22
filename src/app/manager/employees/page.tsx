"use client";

import { useEffect, useState } from "react";
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

export default function ManagerEmployeesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<{ data: User[] }>("/user");
        setUsers(response.data.data);
        setFiltered(response.data.data);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, users]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">موظفو القسم</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ابحث بالاسم..."
          className="border px-3 py-1 rounded text-sm w-64"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">جارٍ تحميل البيانات...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
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
              </tr>
            </thead>
            <tbody className="text-gray-800 divide-y">
              {filtered.length > 0 ? (
                filtered.map((user) => {
                  const { label, classes } = STATUS_MAP[user.status];
                  return (
                    <tr key={user.id} className="hover:bg-blue-50 transition">
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-6">
                    لا توجد نتائج مطابقة.
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

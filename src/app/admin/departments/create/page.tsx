'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AddDepartmentPage() {
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    manager_id: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await api.get("/managers");
        setManagers(response.data);
      } catch (err) {
        setError("فشل في جلب البيانات");
        console.error("Error fetching managers:", err);
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/departments", formData);
      router.push("/admin/departments");
    } catch (err) {
      setError("فشل في إضافة القسم");
      console.error("Error adding department:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/admin/departments`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة لقائمة الأقسام
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          إضافة قسم جديد
        </h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* اسم القسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم القسم
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* حقل تعيين المدير */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تعيين المدير
          </label>
          <select
            name="manager_id"
            value={formData.manager_id || ""}
            onChange={(e) =>
              setFormData({ ...formData, manager_id: e.target.value || null })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">بدون مدير</option>
            {managers.length > 0 ? (
              managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))
            ) : (
              <option value="">لا يوجد مدراء</option>
            )}
          </select>
        </div>

        {/* زر الإرسال */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "جاري إضافة القسم..." : "إضافة القسم"}
          </button>
        </div>
      </form>
    </div>
  );
}

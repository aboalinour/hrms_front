'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Department {
  id: number;
  name: string;
  manager_id: number | null;
  manager: string | null;
}

export default function EditDepartmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState<Department>({
    id: 0,
    name: "",
    manager_id: null,
    manager: null,
  });

  useEffect(() => {
    if (!id) return;

    const fetchDepartment = async () => {
      try {
        const response = await api.get(`/departments/${id}`);
        const data = response.data.data;
        setFormData({
          id: data.id,
          name: data.name || "",
          manager_id: data.manager_id,
          manager: data.manager,
        });
      } catch (err) {
        setError("فشل في جلب بيانات القسم");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await api.get("/managers");
        setManagers(response.data);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب المديرين");
      }
    };

    fetchDepartment();
    fetchManagers();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/departments/${id}`, formData);
      router.push("/admin/departments");
    } catch (err) {
      setError("فشل في تحديث القسم");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-center py-6 text-gray-500">جارٍ تحميل البيانات...</p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/admin/departments`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة لقائمة الأقسام
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          تعديل القسم
        </h2>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* اسم القسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم القسم
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* اختيار المدير */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اختيار المدير
          </label>
          <select
            name="manager_id"
            value={formData.manager_id || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">بدون مدير</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        {/* زر الحفظ */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition duration-200"
          >
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}

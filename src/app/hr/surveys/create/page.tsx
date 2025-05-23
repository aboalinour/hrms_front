'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Department = {
  id: number;
  name: string;
};

export default function CreateSurveyPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const availableRoles = ["admin", "manager", "hr", "employee"];

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "internal",
    url: "",
    target_department_id: "",
    target_roles: ["employee"],
    is_active: true,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;

    setForm({
      ...form,
      [target.name]: value,
    });
  };

  const handleRoleToggle = (role: string) => {
    setForm((prev) => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter((r) => r !== role)
        : [...prev.target_roles, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        target_department_id:
          form.target_department_id === "" ? null : form.target_department_id,
        url: form.type === "external" ? form.url : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      await api.post("/surveys", payload);
      router.push("/hr/surveys");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push("/hr/surveys")}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة إلى إدارة الاستبيانات ←
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">إضافة استبيان</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">العنوان</label>
          <input
            name="title"
            className="w-full border p-2 rounded"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">النوع</label>
          <select
            name="type"
            className="w-full border p-2 rounded"
            value={form.type}
            onChange={handleChange}
          >
            <option value="internal">داخلي</option>
            <option value="external">خارجي</option>
          </select>
        </div>

        {form.type === "external" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              رابط الإستبيان
            </label>
            <input
              name="url"
              className="w-full border p-2 rounded"
              value={form.url}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            القسم المستهدف
          </label>
          <select
            name="target_department_id"
            className="w-full border p-2 rounded"
            value={form.target_department_id}
            onChange={handleChange}
          >
            <option value="">كل الأقسام</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            الأدوار المستهدفة
          </label>
          <div className="flex flex-wrap gap-3">
            {availableRoles.map((role) => (
              <label key={role} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.target_roles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          <label className="text-sm">مفعل</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              تاريخ البدء
            </label>
            <input
              type="date"
              name="start_date"
              className="w-full border p-2 rounded"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              تاريخ الانتهاء
            </label>
            <input
              type="date"
              name="end_date"
              className="w-full border p-2 rounded"
              value={form.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          إضافة الإستبيان
        </button>
      </form>
    </div>
  );
}

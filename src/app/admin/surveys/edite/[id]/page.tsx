'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";

type SurveyForm = {
  title: string;
  description?: string;
  type: "internal" | "external";
  url?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
};

export default function EditSurveyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<SurveyForm | null>(null);

  useEffect(() => {
    api
      .get(`/surveys/${id}`)
      .then((res) => setForm(res.data.data))
      .catch(console.error);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const name = target.name;
    let value: string | boolean = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = target.checked;
    }

    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/surveys/${id}`, form);
      router.push("/admin/surveys");
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert(err.response.data.message || "غير مصرح لك بتعديل هذا الاستبيان.");
      } else {
        alert("حدث خطأ أثناء محاولة حفظ التعديلات.");
        console.error(err);
      }
    }
  };

  if (!form) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/surveys")}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة إلى إدارة الاستبيانات ←
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          تعديل الإستبيان
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-lg shadow"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            العنوان
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            الوصف
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={form.description || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="type"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            النوع
          </label>
          <select
            name="type"
            id="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </div>

        {/* URL */}
        {form.type === "external" && (
          <div>
            <label
              htmlFor="url"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              رابط الاستبيان
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={form.url || ""}
              onChange={handleChange}
              required
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>
        )}

        {/* Is Active */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_active"
            className="ml-2 block text-sm text-gray-700"
          >
            فعال
          </label>
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor="start_date"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            تاريخ البداية
          </label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={form.start_date ? form.start_date.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="end_date"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            تاريخ النهاية
          </label>
          <input
            type="date"
            name="end_date"
            id="end_date"
            value={form.end_date ? form.end_date.slice(0, 10) : ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LeaveRequestForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    subtype: "",
    start_date: "",
    end_date: "",
    reason: "",
    attachment: null as File | null,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, attachment: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const data = new FormData();
    data.append("subtype", form.subtype);
    data.append("start_date", form.start_date);
    data.append("end_date", form.end_date);
    data.append("reason", form.reason);
    if (form.subtype !== "administrative" && form.attachment) {
      data.append("attachment", form.attachment);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/leave-requests", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("✅ تم إرسال الطلب بنجاح");

      // Redirect after 1 second
      setTimeout(() => {
        router.push("/employee/requests/my");
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || err.message);
        setError("❌ فشل في إرسال الطلب. تأكد من صحة البيانات.");
      } else {
        console.error(err);
        setError("حدث خطأ غير متوقع.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded shadow"
    >
      <h1 className="text-2xl font-bold text-center mb-4">طلب إجازة</h1>

      <div>
        <label className="block font-medium mb-1">نوع الإجازة</label>
        <select
          name="subtype"
          value={form.subtype}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">اختر النوع</option>
          <option value="study">دراسية</option>
          <option value="medical">مرضية</option>
          <option value="administrative">إدارية</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1">تاريخ البداية</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">تاريخ النهاية</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">سبب الإجازة</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
          required
        ></textarea>
      </div>

      {form.subtype !== "administrative" && (
        <div className="mb-4">
          <label className="block font-medium mb-1">
            إرفاق ملف (pdf/jpg/png)
          </label>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
              📎 اختر ملف
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {form.attachment && (
              <span className="text-sm text-green-700">
                {form.attachment.name}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 2MB</p>
        </div>
      )}

      {success && <p className="text-green-600 font-medium">{success}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
      >
        إرسال الطلب
      </button>
    </form>
  );
}

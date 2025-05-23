'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

interface FormState {
  subtype: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment: File | null;
}

export default function EditLeaveRequestPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    subtype: "",
    start_date: "",
    end_date: "",
    reason: "",
    attachment: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/leave-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data;
        setForm({
          subtype: data.subtype,
          start_date: data.start_date,
          end_date: data.end_date,
          reason: data.reason,
          attachment: null,
        });
      } catch {
        setError("❌ فشل في تحميل بيانات الطلب.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, attachment: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      (form.subtype === "study" || form.subtype === "medical") &&
      !form.attachment
    ) {
      setError("يرجى إرفاق ملف عند اختيار نوع إجازة دراسية أو مرضية.");
      return;
    }

    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("subtype", form.subtype);
    data.append("start_date", form.start_date);
    data.append("end_date", form.end_date);
    data.append("reason", form.reason);
    if (form.attachment) {
      data.append("attachment", form.attachment);
    }

    try {
      await api.post(`/leave-requests/${id}?_method=PATCH`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("✅ تم تحديث الطلب بنجاح");
      router.push("/employee/requests/my");
    } catch {
      setError("❌ حدث خطأ أثناء التحديث. تأكد من صحة البيانات.");
    }
  };

  if (loading)
    return <p className="text-center py-10">⏳ جاري تحميل البيانات...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 mt-10 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        تعديل طلب الإجازة
      </h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="w-1/2">
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
          <div className="w-1/2">
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
            rows={3}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            {form.subtype === "study" || form.subtype === "medical"
              ? "إرفاق ملف (إلزامي)"
              : "تعديل المرفق (اختياري)"}
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}

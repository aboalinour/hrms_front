'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation"; // استخدم useParams للوصول إلى المعاملات في الرابط
import api from "@/lib/axios";

interface StatementRequest {
  id: string;
  subtype: string;
  reason: string;
  user_name: string;
  created_at: string;
}

export default function StatementEditPage() {
  const { id } = useParams<{ id: string }>(); // استخراج الـ ID من URL
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StatementRequest>({
    id: "",
    subtype: "",
    reason: "",
    user_name: "",
    created_at: "",
  });

  useEffect(() => {
    if (!id) return;

    // جلب بيانات بيان الوضع
    const fetchStatementData = async () => {
      try {
        const response = await api.get(`/statement-requests/${id}`);
        const data = response.data.data; // استخراج البيانات من الاستجابة
        setFormData({
          id: data.id,
          subtype: data.subtype || "salary", // تعيين القيمة الافتراضية أو القيمة القديمة
          reason: data.reason || "",
          user_name: data.user_name,
          created_at: data.created_at,
        });
      } catch (err) {
        setError("فشل في جلب بيانات بيان الوضع");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatementData();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // تحقق من أنه إذا كانت `subtype` فارغة، نتركها كما كانت
    if (!formData.subtype) {
      formData.subtype = formData.subtype || "salary"; // إذا كانت فارغة، نعيد القيمة القديمة (أو القيمة الافتراضية)
    }

    try {
      await api.put(`/statement-requests/${id}`, formData); // إرسال التعديل
      router.push("/admin/requests"); // العودة إلى قائمة الطلبات بعد التعديل
    } catch (err) {
      setError("فشل في تحديث بيانات بيان الوضع");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center">جارٍ تحميل البيانات...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">تعديل بيان الوضع</h2>
      <form onSubmit={handleSubmit}>
        {/* حقل نوع البيان */}
        <div className="mb-4">
          <label className="block text-sm font-medium">نوع البيان</label>
          <select
            name="subtype"
            value={formData.subtype} // التأكد من أن القيمة الحالية لا تكون فارغة
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="salary">بيان راتب</option>
            <option value="status">بيان وضع</option>
          </select>
        </div>

        {/* حقل السبب */}
        <div className="mb-4">
          <label className="block text-sm font-medium">السبب</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
            rows={4}
          />
        </div>

        {/* زر الحفظ */}
        <div className="mb-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}

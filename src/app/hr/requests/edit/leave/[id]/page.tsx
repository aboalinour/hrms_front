'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation"; // استخدم useParams للوصول إلى المعاملات في الرابط
import api from "@/lib/axios";

interface LeaveRequest {
  id: string;
  subtype: string;
  start_date: string;
  end_date: string;
  reason: string;
  user_name: string;
  attachments: Array<{ id: string; file_path: string }>; // تأكد من أن المرفقات هي مصفوفة
  created_at: string;
}

export default function LeaveRequestEditPage() {
  const { id } = useParams<{ id: string }>(); // استخراج الـ ID من URL
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LeaveRequest>({
    id: "",
    subtype: "medical", // التأكد من تعيين القيمة الافتراضية
    start_date: "",
    end_date: "",
    reason: "",
    user_name: "",
    attachments: [], // تأكد من أن المرفقات هي مصفوفة
    created_at: "",
  });

  // جلب بيانات طلب الإجازة
  useEffect(() => {
    if (!id) return;

    const fetchLeaveRequestData = async () => {
      try {
        const response = await api.get(`/leave-requests/${id}`);
        const data = response.data.data; // استخراج البيانات من الاستجابة
        setFormData({
          id: data.id,
          subtype: data.subtype || "medical", // تعيين القيمة الافتراضية إذا كانت فارغة
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          reason: data.reason || "",
          user_name: data.user_name,
          attachments: data.attachments || [], // التأكد من تحميل المرفقات
          created_at: data.created_at,
        });
      } catch (err) {
        setError("فشل في جلب بيانات طلب الإجازة");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequestData();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // تحويل الملفات إلى مصفوفة
      const newAttachments = Array.from(files).map((file) => ({
        file_path: URL.createObjectURL(file), // هذا يمكن تغييره لاحقًا ليكون رابط فعلي بعد تحميل الملف
        file_name: file.name, // تعيين اسم الملف
      }));
      
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments], // إضافة المرفقات الجديدة إلى المصفوفة
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // إرسال البيانات مع المرفقات
    const updatedData = {
      subtype: formData.subtype, // التأكد من إرسال subtype الذي يتم اختياره من المستخدم
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason,
      attachments: formData.attachments,
    };

    try {
      await api.put(`/leave-requests/${id}`, updatedData); // إرسال التعديل
      router.push("/admin/requests"); // العودة إلى قائمة الطلبات بعد التعديل
    } catch (err) {
      setError("فشل في تحديث بيانات طلب الإجازة");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center">جارٍ تحميل البيانات...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">تعديل طلب الإجازة</h2>
      <form onSubmit={handleSubmit}>
        {/* حقل نوع الإجازة */}
        <div className="mb-4">
          <label className="block text-sm font-medium">نوع الإجازة</label>
          <select
            name="subtype"
            value={formData.subtype}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="medical">إجازة مرضية</option>
            <option value="study">إجازة دراسية</option>
            <option value="administrative">إجازة إدارية</option>
          </select>
        </div>

        {/* حقل تاريخ البداية */}
        <div className="mb-4">
          <label className="block text-sm font-medium">تاريخ البداية</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        {/* حقل تاريخ النهاية */}
        <div className="mb-4">
          <label className="block text-sm font-medium">تاريخ النهاية</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          />
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

        {/* عرض المرفقات السابقة */}
        <div className="mb-4">
          <label className="block text-sm font-medium">المرفقات السابقة</label>
          <ul>
            {formData.attachments.length > 0 ? (
              formData.attachments.map((attachment, index) => (
                <li key={index}>
                  <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                    {attachment.file_name}
                  </a>
                </li>
              ))
            ) : (
              <p>لا توجد مرفقات سابقة.</p>
            )}
          </ul>
        </div>

        {/* حقل تحميل مرفق جديد */}
        <div className="mb-4">
          <label className="block text-sm font-medium">تحميل مرفق جديد</label>
          <input
            type="file"
            name="attachments"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full border rounded p-2"
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

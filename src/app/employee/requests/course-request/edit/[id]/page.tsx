'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function EditCourseRequestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    custom_course_title: "",
    custom_course_provider: "",
    // أضف الحقول الأخرى حسب الحاجة
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/course-requests/${id}`);
        const data = res.data.data;
        setForm({
          custom_course_title: data.custom_course_title || "",
          custom_course_provider: data.custom_course_provider || "",
        });
      } catch (err) {
        console.error(err);
        alert("فشل في جلب بيانات الطلب");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/course-requests/${id}`, form);
      alert("تم التحديث بنجاح");
      router.push("/employee/requests/my");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  if (loading) return <div className="p-6">جاري تحميل البيانات...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">تعديل طلب الدورة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">عنوان الدورة المخصصة</label>
          <input
            type="text"
            value={form.custom_course_title}
            onChange={(e) =>
              setForm({ ...form, custom_course_title: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">جهة التدريب</label>
          <input
            type="text"
            value={form.custom_course_provider}
            onChange={(e) =>
              setForm({ ...form, custom_course_provider: e.target.value })
            }
            className="w-full border rounded p-2"
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

'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation"; // استخدم useParams للوصول إلى المعاملات في الرابط
import api from "@/lib/axios";

interface CourseRequest {
  id: string;
  course_id: string | null;
  custom_course_title: string | null;
  custom_course_provider: string | null;
  reason: string;
  user_name: string;
  created_at: string;
}

export default function CourseEditPage() {
  const { id } = useParams<{ id: string }>(); // استخراج الـ ID من URL
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]); // قائمة الدورات
  const [formData, setFormData] = useState<CourseRequest>({
    id: "",
    course_id: null,
    custom_course_title: "",
    custom_course_provider: "",
    reason: "",
    user_name: "",
    created_at: "",
  });

  // إضافة حالة لتتبع إذا كانت الدورة حالية أو خارجية
  const [isCurrentCourseSelected, setIsCurrentCourseSelected] = useState<boolean>(true); // الدورة حالياً، default: true

  useEffect(() => {
    if (!id) return;

    // جلب بيانات طلب الدورة
    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/course-requests/${id}`);
        const data = response.data.data;
        setFormData({
          id: data.id,
          course_id: data.course_id || null,
          custom_course_title: data.custom_course_title || "",
          custom_course_provider: data.custom_course_provider || "",
          reason: data.reason || "",
          user_name: data.user_name,
          created_at: data.created_at,
        });

        // التحقق من نوع الدورة إذا كانت دورة حالية أو خارجية
        if (data.course_id) {
          setIsCurrentCourseSelected(true); // إذا كانت دورة حالية
        } else {
          setIsCurrentCourseSelected(false); // إذا كانت دورة خارجية
        }
      } catch (err) {
        setError("فشل في جلب بيانات طلب الدورة");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // جلب الدورات المتاحة
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course "); // تأكد من المسار في الـ API
        const data = response.data.data; // الوصول إلى البيانات داخل الكائن

        // تعيين الدورات بشكل صحيح (باستخدام العنوان فقط)
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب الدورات المتاحة");
      }
    };

    fetchCourseData();
    fetchCourses();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // تغيير حالة الدورة إلى "دورة حالية" أو "دورة خارجية"
  const handleCourseTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsCurrentCourseSelected(value === "current"); // إذا كانت "current"، الدورة حالية
    setFormData({
      ...formData,
      course_id: value === "current" ? null : formData.course_id, // إعادة تعيين الدورة عند الاختيار
      custom_course_title: value === "external" ? "" : formData.custom_course_title,
      custom_course_provider: value === "external" ? "" : formData.custom_course_provider,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/course-requests/${id}`, formData); // إرسال التعديل
      router.push("/admin/requests"); // العودة إلى قائمة الطلبات بعد التعديل
    } catch (err) {
      setError("فشل في تحديث بيانات طلب الدورة");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center">جارٍ تحميل البيانات...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">تعديل طلب الدورة</h2>
      <form onSubmit={handleSubmit}>
        {/* حقل اختيار نوع الدورة */}
        <div className="mb-4">
          <label className="block text-sm font-medium">نوع الدورة</label>
          <select
            name="course_type"
            value={isCurrentCourseSelected ? "current" : "external"}
            onChange={handleCourseTypeChange}
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="current">دورة حالية</option>
            <option value="external">دورة خارجية</option>
          </select>
        </div>

        {/* حقل اختيار الدورة الحالية */}
        {isCurrentCourseSelected && (
          <div className="mb-4">
            <label className="block text-sm font-medium">اختيار الدورة</label>
            <select
              name="course_id"
              value={formData.course_id || ""}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">اختر الدورة</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* حقول الدورة الخارجية */}
        {!isCurrentCourseSelected && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">عنوان الدورة (إذا كانت دورة خارجية)</label>
              <input
                name="custom_course_title"
                type="text"
                value={formData.custom_course_title || ""}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">مقدم الدورة (إذا كانت دورة خارجية)</label>
              <input
                name="custom_course_provider"
                type="text"
                value={formData.custom_course_provider || ""}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
          </>
        )}

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

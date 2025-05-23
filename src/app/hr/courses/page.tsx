'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Course {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  instructor: string;
  available: boolean;
  created_at: string;
}

export default function CourseTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<{ data: Course[] }>("/course");
        setCourses(response.data.data);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (id: number) => router.push(`/hr/courses/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟")) return;

    try {
      await api.delete(`/course/${id}`);
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      console.error(err);
      alert("فشل في حذف الدورة");
    }
  };

  const handleAdd = () => {
    router.push("/hr/courses/create");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        قائمة الدورات
      </h2>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 mb-4 transition duration-200"
      >
        إضافة دورة جديدة
      </button>

      {loading ? (
        <p className="text-center text-gray-500">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-right border-separate border-spacing-0">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-sm font-medium">اسم الدورة</th>
                <th className="px-6 py-3 text-sm font-medium">الموقع</th>
                <th className="px-6 py-3 text-sm font-medium">المدرب</th>
                <th className="px-6 py-3 text-sm font-medium">متاحة؟</th>
                <th className="px-6 py-3 text-sm font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{course.name}</td>
                    <td className="px-6 py-3">{course.location}</td>
                    <td className="px-6 py-3">{course.instructor}</td>
                    <td className="px-6 py-3">
                      {course.available ? "نعم" : "لا"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-6 justify-end">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEdit(course.id)}
                        >
                          تعديل
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(course.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    لا توجد دورات لعرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

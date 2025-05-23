'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

const schema = z
  .object({
    course_id: z.string().optional(),
    custom_course_title: z.string().optional(),
    custom_course_provider: z.string().optional(),
    reason: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasCourseId = !!data.course_id;
      const hasCustom = !!data.custom_course_title;
      return (hasCourseId || hasCustom) && !(hasCourseId && hasCustom);
    },
    {
      message: "يجب اختيار دورة موجودة أو كتابة دورة خارجية، وليس الاثنين معًا",
      path: ["course_id"],
    }
  );

type FormData = z.infer<typeof schema>;

interface Course {
  id: string;
  name: string;
}

export default function CreateCourseRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("course_id");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedCourseId = watch("course_id");

  // ✅ تعيين course_id من الرابط عند تحميل الصفحة
  useEffect(() => {
    if (preselectedCourseId) {
      setValue("course_id", preselectedCourseId);
      checkIfAlreadyRegistered(preselectedCourseId);
    }
  }, [preselectedCourseId, setValue]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get("/course");
        if (res.data?.data) {
          setCourses(res.data.data);
        } else {
          setError("لم يتم العثور على الدورات");
        }
      } catch (err) {
        setError("حدث خطأ في تحميل الدورات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const checkIfAlreadyRegistered = async (courseId: string) => {
    try {
      const res = await api.get(`/course-requests/check/${courseId}`);
      setAlreadyRegistered(res.data.exists);
    } catch (error) {
      setError("حدث خطأ أثناء التحقق من التسجيل");
      console.error(error);
    }
  };

  const onSubmit = async (data: FormData) => {
    const payload = { ...data };
    if (!payload.course_id) delete payload.course_id;
    if (!payload.custom_course_title) delete payload.custom_course_title;
    if (!payload.custom_course_provider) delete payload.custom_course_provider;
    if (!payload.reason) delete payload.reason;

    try {
      await api.post("/course-requests", payload);
      alert("تم تقديم الطلب بنجاح");
      router.push("/employee/requests/my");
    } catch (error: any) {
      if (error.response?.status === 422) {
        const serverMessage =
          error.response.data.message || "خطأ في التحقق من البيانات";
        const errors = error.response.data.errors || null;

        if (errors) {
          const messages = Object.values(errors).flat();
          alert(messages.join("\n"));
        } else if (serverMessage) {
          alert(serverMessage);
        } else {
          alert("حدث خطأ أثناء تقديم الطلب");
        }
      } else {
        alert("حدث خطأ أثناء تقديم الطلب");
      }
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">طلب تسجيل دورة</h1>

      {loading ? (
        <div>جاري تحميل الدورات...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="font-medium">اختيار دورة من النظام</label>
            <select
              {...register("course_id")}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">— اختر دورة —</option>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              ) : (
                <option disabled>لا توجد دورات حالياً</option>
              )}
            </select>
          </div>

          {!selectedCourseId && (
            <>
              <div>
                <label className="font-medium">أو اكتب دورة خارجية</label>
                <input
                  type="text"
                  {...register("custom_course_title")}
                  placeholder="عنوان الدورة الخارجية"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-medium">
                  الجهة المقدمة للدورة (اختياري)
                </label>
                <input
                  type="text"
                  {...register("custom_course_provider")}
                  placeholder="مثال: منصة إدراك"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-medium">سبب التسجيل (اختياري)</label>
            <textarea
              {...register("reason")}
              rows={4}
              className="w-full mt-1 p-2 border rounded"
              placeholder="لماذا ترغب في التسجيل بهذه الدورة؟"
            ></textarea>
          </div>

          {errors.course_id && (
            <p className="text-red-600 text-sm">{errors.course_id.message}</p>
          )}

          {alreadyRegistered && (
            <p className="text-red-500 text-sm">
              لقد قمت بطلب التسجيل في هذه الدورة مسبقًا.
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            تقديم الطلب
          </button>
        </form>
      )}
    </div>
  );
}

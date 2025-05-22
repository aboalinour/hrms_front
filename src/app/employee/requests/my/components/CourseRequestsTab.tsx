"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import React from "react";

interface CourseRequest {
  id: number;
  custom_course_title: string | null;
  custom_course_provider: string | null;
  course: {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    instructor: string;
    available: boolean;
    created_at: string;
  } | null;
  status: string;
  link?: string | null;
  attachments: string[];
  created_at: string;
}

export default function CourseRequestsTab() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/course-requests");
        setRequests(res.data.data);
      } catch (err) {
        setError("فشل في جلب الطلبات.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذا الطلب؟")) return;

    setDeleting(true);
    try {
      const response = await api.delete(`/course-requests/${id}`);
      if (response.status === 200) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        alert("تم حذف الطلب بنجاح");
      }
    } catch (err) {
      alert("فشل في حذف الطلب");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const renderRequests = () =>
    requests.map((req) => (
      <tr key={req.id} className="text-right border-b hover:bg-gray-50">
        <td className="p-3">{req.id}</td>
        <td className="p-3">
          {req.custom_course_title || req.course?.name || "—"}
        </td>
        <td className="p-3">{req.custom_course_provider || "—"}</td>
        <td className="p-3">
          {new Date(req.created_at).toLocaleDateString("ar-EG")}
        </td>
        <td className="p-3">
          {req.status === "pending"
            ? "قيد المراجعة"
            : req.status === "approved"
            ? "موافقة"
            : "مرفوضة"}
        </td>
        <td className="p-3">
          {req.link ? (
            <a
              href={req.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              عرض الرابط
            </a>
          ) : (
            "—"
          )}
        </td>
        <td className="p-3 text-blue-700 text-sm">
          {req.attachments?.length ? (
            <div className="flex flex-col gap-1">
              {req.attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  📎 ملف {index + 1}
                </a>
              ))}
            </div>
          ) : (
            "—"
          )}
        </td>
        <td className="p-3 space-x-2 space-x-reverse">
          {req.status === "pending" && (
            <>
              <button
                onClick={() =>
                  router.push(
                    `/employee/requests/course-request/edit/${req.id}`
                  )
                }
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(req.id)}
                className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ${
                  deleting ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={deleting}
              >
                {deleting ? "جاري الحذف..." : "حذف"}
              </button>
            </>
          )}
        </td>
      </tr>
    ));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        طلبات تسجيل الدورات
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">جاري تحميل البيانات...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-auto rounded shadow-md">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white text-right">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">عنوان الدورة</th>
                <th className="p-3">الجهة</th>
                <th className="p-3">تاريخ الطلب</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">رابط الدورة</th>
                <th className="p-3">المرفقات</th>
                <th className="p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>{renderRequests()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

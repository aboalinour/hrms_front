'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import dayjs from "dayjs";

type RequestType = "leave" | "statement" | "course";

interface Attachment {
  id: number;
  file_name: string;
  url: string;
}

interface Approval {
  id: string;
  role: string;
  status: string;
  comment?: string;
  approved_by: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface BaseRequestDetails {
  id: string;
  status: string;
  reason?: string;
  comment?: string;
  user_name?: string;
  attachments: Attachment[];
  created_at: string;
  updated_at?: string;
}

interface LeaveRequestDetails extends BaseRequestDetails {
  subtype?: string;
  start_date?: string;
  end_date?: string;
  approvals?: Approval[];
}

interface StatementRequestDetails extends BaseRequestDetails {
  subtype?: string;
}

interface CourseRequestDetails extends BaseRequestDetails {
  course_name?: string;
  custom_course_title?: string;
  custom_course_provider?: string;
}

type RequestDetails =
  | LeaveRequestDetails
  | StatementRequestDetails
  | CourseRequestDetails;

export default function RequestDetailsPage() {
  const { type, id } = useParams() as { type: RequestType; id: string };
  const router = useRouter();

  const [data, setData] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await api.get(`/${type}-requests/${id}`);
        setData(res.data.data);
      } catch (e) {
        setError("فشل تحميل بيانات الطلب");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [type, id]);

  if (loading) return <p className="p-6">جاري التحميل...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!data) return <p className="p-6">لا توجد بيانات للطلب.</p>;

  const displayName =
    type === "course"
      ? (data as CourseRequestDetails).course_name ||
        (data as CourseRequestDetails).custom_course_title ||
        ""
      : (data as LeaveRequestDetails | StatementRequestDetails).subtype || "";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">تفاصيل طلب {displayName}</h1>

      <div className="mb-3">
        <strong>الحالة:</strong> {data.status}
      </div>

      {type === "leave" && (
        <>
          <div className="mb-3">
            <strong>نوع الإجازة:</strong>{" "}
            {(data as LeaveRequestDetails).subtype || "-"}
          </div>
          <div className="mb-3">
            <strong>تاريخ البداية:</strong>{" "}
            {(data as LeaveRequestDetails).start_date || "-"}
          </div>
          <div className="mb-3">
            <strong>تاريخ النهاية:</strong>{" "}
            {(data as LeaveRequestDetails).end_date || "-"}
          </div>
        </>
      )}

      {type === "statement" && (
        <div className="mb-3">
          <strong>نوع البيان:</strong>{" "}
          {(data as StatementRequestDetails).subtype || "-"}
        </div>
      )}

      {type === "course" && (
        <div className="mb-3">
          <strong>مزود الدورة (إن وجد):</strong>{" "}
          {(data as CourseRequestDetails).custom_course_provider || "-"}
        </div>
      )}

      {data.reason && (
        <div className="mb-3">
          <strong>السبب:</strong> {data.reason}
        </div>
      )}
      {data.comment && (
        <div className="mb-3">
          <strong>تعليق:</strong> {data.comment}
        </div>
      )}

      <div className="mb-3">
        <strong>المستخدم:</strong> {data.user_name || "غير معروف"}
      </div>

      {/* ✅ عرض المرفقات بشكل آمن */}
      <div className="mb-3">
        <strong>المرفقات:</strong>
        {data.attachments && data.attachments.length > 0 ? (
          <ul className="list-disc list-inside text-blue-600">
            {data.attachments.map((att, idx) => (
              <li key={att.id || idx}>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  {att.file_name || `attachment-${idx + 1}`}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>لا توجد مرفقات</p>
        )}
      </div>

      {/* ✅ سجل الموافقات إن وجد */}
      {"approvals" in data &&
        Array.isArray((data as LeaveRequestDetails).approvals) && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">سجل الموافقات:</h2>
            <ul className="space-y-2">
              {(data as LeaveRequestDetails).approvals?.map((approval) => (
                <li key={approval.id} className="bg-gray-100 rounded p-3">
                  <p>
                    <strong>الدور:</strong> {approval.role} —{" "}
                    <strong>الحالة:</strong>{" "}
                    <span
                      className={
                        approval.status === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {approval.status === "approved" ? "موافق" : "مرفوض"}
                    </span>
                  </p>
                  <p>
                    <strong>بواسطة:</strong>{" "}
                    {approval.approved_by?.name || "غير معروف"}
                  </p>
                  {approval.comment && (
                    <p>
                      <strong>تعليق:</strong> {approval.comment}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {dayjs(approval.created_at).format("YYYY-MM-DD HH:mm")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

      <div className="mt-6 flex space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          العودة
        </button>
      </div>
    </div>
  );
}

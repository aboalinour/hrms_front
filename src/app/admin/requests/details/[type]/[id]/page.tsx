'use client';
export const dynamic = 'force-dynamic';
// src/app/admin/requests/details/[type]/[id]/page.tsx


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import dayjs from 'dayjs';

type RequestType = 'leave' | 'statement' | 'course';

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
  attachments: Attachment[] | string[];
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
  link?: string;
}

type RequestDetails = LeaveRequestDetails | StatementRequestDetails | CourseRequestDetails;

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
        setError('فشل تحميل بيانات الطلب');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [type, id]);

  if (loading) return <p className="p-6 text-blue-500 animate-pulse">🔄 جاري التحميل...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!data) return <p className="p-6">لا توجد بيانات للطلب.</p>;

  const displayName =
    type === 'course'
      ? (data as CourseRequestDetails).course_name || (data as CourseRequestDetails).custom_course_title || ''
      : (data as LeaveRequestDetails | StatementRequestDetails).subtype || '';

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6 border border-gray-200 text-right">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">📄 تفاصيل طلب {displayName}</h1>

      <table className="w-full table-auto border border-gray-200 rounded overflow-hidden mb-6">
        <tbody className="text-sm text-gray-700">
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold bg-gray-50 w-1/3">الحالة</td>
            <td className="px-4 py-2">{data.status}</td>
          </tr>

          {'subtype' in data && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">النوع</td>
              <td className="px-4 py-2">{(data as LeaveRequestDetails | StatementRequestDetails).subtype}</td>
            </tr>
          )}

          {'start_date' in data && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">تاريخ البداية</td>
              <td className="px-4 py-2">{(data as LeaveRequestDetails).start_date}</td>
            </tr>
          )}

          {'end_date' in data && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">تاريخ النهاية</td>
              <td className="px-4 py-2">{(data as LeaveRequestDetails).end_date}</td>
            </tr>
          )}

          {'custom_course_provider' in data && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">مزود الدورة</td>
              <td className="px-4 py-2">{(data as CourseRequestDetails).custom_course_provider || '—'}</td>
            </tr>
          )}

          {'link' in data && (data as CourseRequestDetails).link && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">رابط الدورة</td>
              <td className="px-4 py-2">
                <a href={(data as CourseRequestDetails).link!} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {(data as CourseRequestDetails).link}
                </a>
              </td>
            </tr>
          )}

          {data.reason && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">السبب</td>
              <td className="px-4 py-2">{data.reason}</td>
            </tr>
          )}

          {data.comment && (
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold bg-gray-50">التعليق</td>
              <td className="px-4 py-2">{data.comment}</td>
            </tr>
          )}

          <tr>
            <td className="px-4 py-2 font-semibold bg-gray-50">المستخدم</td>
            <td className="px-4 py-2">{data.user_name}</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">📎 المرفقات:</h2>
        {data.attachments?.length ? (
          <ul className="list-disc list-inside text-blue-600">
            {data.attachments.map((att: any, index: number) => {
              const isString = typeof att === 'string';
              const fileUrl = isString ? att : att.url || '';
              const fileName = isString ? `مرفق ${index + 1}` : att.file_name || `مرفق ${index + 1}`;
              const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}${fileUrl}`;

              return (
                <li key={index}>
                  <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">لا توجد مرفقات.</p>
        )}
      </div>

      {'approvals' in data && Array.isArray((data as LeaveRequestDetails).approvals) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">🗳️ سجل الموافقات:</h2>
          <ul className="space-y-2">
            {(data as LeaveRequestDetails).approvals?.map((approval) => (
              <li key={approval.id} className="bg-gray-100 border-r-4 p-4 rounded shadow-sm border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{approval.role.toUpperCase()} - {approval.status === 'approved' ? '✅ موافق' : '❌ مرفوض'}</p>
                    {approval.comment && <p className="text-sm text-gray-700">💬 {approval.comment}</p>}
                  </div>
                  <div className="text-sm text-gray-500 text-left">
                    <p>بواسطة: {approval.approved_by?.name || 'غير معروف'}</p>
                    <p>{dayjs(approval.created_at).format('YYYY-MM-DD HH:mm')}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push('/admin/requests');
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          🔙 العودة
        </button>
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import dayjs from 'dayjs';
import api from '@/lib/axios';
//src\app\manager\requests\components\RequestRow.tsx
interface RequestDetailsProps {
  params: {
    type: string;
    id: string;
  };
}

interface RequestData {
  id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  subtype?: string;
  custom_course_title?: string;
  course_name?: string;
  reason?: string;
  comment?: string;
  attachments?: { id: string; file_name: string; url: string }[];
  // أضف أي بيانات إضافية تحتاجها هنا
}

export default async function RequestDetailsPage({ params }: RequestDetailsProps) {
  const { type, id } = params;

  let requestData: RequestData | null = null;
  try {
    const response = await api.get(`/${type}-requests/${id}`);
    requestData = response.data;
  } catch (error) {
    console.error('Failed to fetch request details', error);
    notFound();
  }

  if (!requestData) {
    notFound();
  }

  const displayName =
    type === 'course'
      ? requestData.course_name || requestData.custom_course_title
      : requestData.subtype || requestData.type;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">تفاصيل الطلب</h1>

      <div className="mb-4">
        <strong>نوع الطلب:</strong> {displayName}
      </div>

      <div className="mb-4">
        <strong>الحالة:</strong> {requestData.status}
      </div>

      <div className="mb-4">
        <strong>التاريخ:</strong> {dayjs(requestData.created_at).format('YYYY-MM-DD')}
      </div>

      <div className="mb-4">
        <strong>المستخدم:</strong> {requestData.user_name || 'غير معروف'}
      </div>

      {requestData.reason && (
        <div className="mb-4">
          <strong>السبب:</strong> {requestData.reason}
        </div>
      )}

      {requestData.comment && (
        <div className="mb-4">
          <strong>تعليق:</strong> {requestData.comment}
        </div>
      )}

      <div className="mb-4">
        <strong>المرفقات:</strong>
        {requestData.attachments && requestData.attachments.length > 0 ? (
          <ul className="list-disc list-inside">
            {requestData.attachments.map((att) => (
              <li key={att.id}>
                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {att.file_name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>لا توجد مرفقات</p>
        )}
      </div>
    </div>
  );
}

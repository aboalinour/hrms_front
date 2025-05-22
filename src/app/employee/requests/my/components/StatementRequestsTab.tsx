// src/app/employee/requests/my/components/StatementRequestsTab.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface StatementRequest {
  id: number;
  type: 'salary' | 'status';
  reason: string;
  status: string;
  created_at: string;
  attachments: string[];
}

export default function StatementRequestsTab() {
  const [requests, setRequests] = useState<StatementRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/statement-requests');
        setRequests(res.data.data);
      } catch (err) {
        console.error('خطأ في جلب طلبات البيانات:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذا الطلب؟')) return;
    try {
      await api.delete(`/statement-requests/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('فشل في حذف الطلب');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">طلبات البيانات</h2>

      <div className="overflow-auto rounded shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-600 text-white text-right">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">نوع البيان</th>
              <th className="p-3">السبب</th>
              <th className="p-3">تاريخ الطلب</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">المرفقات</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="text-right border-b hover:bg-gray-50">
                <td className="p-3">{req.id}</td>
                <td className="p-3">
                  {req.type === 'salary' ? 'بيان مالي' : 'بيان وضع'}
                </td>
                <td className="p-3">{req.reason}</td>
                <td className="p-3">
                  {new Date(req.created_at).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-3">
                  {req.status === 'pending'
                    ? 'قيد المراجعة'
                    : req.status === 'approved'
                    ? 'موافق عليه'
                    : 'مرفوض'}
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
                    '—'
                  )}
                </td>
                <td className="p-3 space-x-2 space-x-reverse">
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() =>
                          router.push(`/employee/requests/statement-request/edit/${req.id}`)
                        }
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        حذف
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

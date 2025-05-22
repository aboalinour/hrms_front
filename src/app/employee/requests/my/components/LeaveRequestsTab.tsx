'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface LeaveRequest {
  id: number;
  subtype: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  attachments: string[];
}

export default function MyLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/leave-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data.data);
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف الطلب؟')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/leave-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('فشل في حذف الطلب');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">طلباتي السابقة</h1>

      <div className="overflow-auto rounded shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-600 text-white text-right">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">النوع</th>
              <th className="p-3">من</th>
              <th className="p-3">إلى</th>
              <th className="p-3">السبب</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">المرفقات</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="text-right border-b hover:bg-gray-50">
                <td className="p-3">{req.id}</td>
                <td className="p-3">{req.subtype}</td>
                <td className="p-3">{req.start_date}</td>
                <td className="p-3">{req.end_date}</td>
                <td className="p-3">{req.reason}</td>
                <td className="p-3">
                  {req.status === 'pending'
                    ? 'قيد المراجعة'
                    : req.status === 'approved'
                    ? 'موافق عليها'
                    : 'مرفوضة'}
                </td>
                <td className="p-3 text-blue-700 text-sm">
                  {req.attachments.length > 0 ? (
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
                        onClick={() => router.push(`/employee/requests/leave/edit/${req.id}`)}
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

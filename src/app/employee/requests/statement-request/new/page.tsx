'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function NewStatementRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [subtype, setSubtype] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'salary' || type === 'status') {
      setSubtype(type);
    } else {
      setError('❌ نوع الطلب غير صالح.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/statement-requests',
        { subtype, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('✅ تم إرسال الطلب بنجاح');
      router.push('/employee/requests/my');
    } catch {
      setError('❌ فشل في إرسال الطلب. تأكد من البيانات.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {subtype === 'salary' ? 'طلب بيان مالي' : 'طلب بيان وضع'}
      </h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" value={subtype} />

        <div>
          <label className="block font-medium mb-1">الغرض من البيان (اختياري)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          إرسال الطلب
        </button>
      </form>
    </div>
  );
}

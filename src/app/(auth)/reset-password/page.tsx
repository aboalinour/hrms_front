'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailFromURL = searchParams.get('email');

  const [email] = useState(emailFromURL || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setMessage('تم تغيير كلمة المرور بنجاح. سيتم تحويلك لتسجيل الدخول...');
      setTimeout(() => router.push('/'), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('🔴 Reset Password Error:', err.message);
        setError('فشل إعادة التعيين. تأكد من صحة البيانات أو الرابط.');
      } else {
        setError('حدث خطأ غير متوقع.');
      }
    }
  };

  useEffect(() => {
    if (!token || !emailFromURL) {
      setError('رابط غير صالح.');
    }
  }, [token, emailFromURL]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">إعادة تعيين كلمة المرور</h2>

      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="email"
        value={email}
        readOnly
        className="w-full mb-3 p-2 border rounded bg-gray-100"
      />

      <input
        type="password"
        placeholder="كلمة المرور الجديدة"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="تأكيد كلمة المرور"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        إعادة التعيين
      </button>
    </form>
  );
}

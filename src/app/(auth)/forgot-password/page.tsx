'use client';

import { useState } from 'react';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/forgot-password', { email }); // ✅ لا حاجة لـ res إذا لن يُستخدم
      setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('🔴 Forgot Password Error:', err.message);
        setError('فشل في إرسال الرابط. تحقق من صحة البريد.');
      } else {
        setError('حدث خطأ غير متوقع.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">نسيت كلمة المرور؟</h2>

      <input
        type="email"
        required
        placeholder="أدخل بريدك الإلكتروني"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />

      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        إرسال رابط إعادة التعيين
      </button>
    </form>
  );
}

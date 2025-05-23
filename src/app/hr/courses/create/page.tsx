'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

// إعداد axios مركزي
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// إضافة interceptor لإرسال توكن تلقائي من localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

type FormData = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  instructor: string;
  available: boolean;
};

export default function CreateCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    instructor: "",
    available: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Getting CSRF cookie...");

      console.log("CSRF cookie obtained.");

      console.log("Sending POST /course with data:", form);
      const response = await api.post("/course", form);

      console.log("Response from API:", response.data);
      router.push("/admin/courses");
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        console.error("API response error:", err.response.data);
        setError(
          (err.response.data as any)?.message ||
            "فشل في إنشاء الدورة (خطأ من الخادم)"
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("لم يتم استقبال رد من الخادم، تحقق من اتصالك بالإنترنت.");
      } else {
        console.error("Unexpected error:", err.message);
        setError("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/hr/courses`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة إلى قائمة الدورات
        </button>
        <h1 className="text-3xl font-semibold mb-6 text-center">
          إضافة دورة جديدة
        </h1>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="اسم الدورة"
          value={form.name}
          onChange={handleChange}
          required
          className="input-field"
        />

        <textarea
          name="description"
          placeholder="وصف الدورة"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="input-field"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <input
          type="text"
          name="location"
          placeholder="موقع الدورة"
          value={form.location}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="text"
          name="instructor"
          placeholder="اسم المدرب"
          value={form.instructor}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label className="flex items-center space-x-3 rtl:space-x-reverse">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>الدورة متاحة؟</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ الدورة"}
        </button>
      </form>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
        }
        .form-checkbox {
          width: 1.25rem;
          height: 1.25rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          accent-color: #2563eb;
        }
      `}</style>
    </div>
  );
}

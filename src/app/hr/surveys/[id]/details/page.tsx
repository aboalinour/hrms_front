"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface Survey {
  id: number;
  title: string;
  type: "internal" | "external";
  url?: string;
  start_date: string;
  questions: Question[];
}

export default function SurveyDetailsPage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/surveys/${id}`)
      .then((res) => setSurvey(res.data.data))
      .catch((err) => console.error("خطأ في جلب تفاصيل الاستبيان:", err));
  }, [id]);

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    try {
      await api.delete(`/surveys/${id}/questions/${questionId}`);
      setSurvey((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.filter((q) => q.id !== questionId),
            }
          : null
      );
    } catch (err) {
      console.error("خطأ أثناء حذف السؤال:", err);
    }
  };

  const isStarted = () => {
    if (!survey?.start_date) return false;
    return new Date(survey.start_date) <= new Date();
  };

  if (!survey) {
    return (
      <p className="p-6 text-center text-gray-500">
        جاري تحميل تفاصيل الاستبيان...
      </p>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/hr/surveys"
            className="text-sm text-blue-600 hover:underline"
          >
            العودة إلى إدارة الاستبيانات ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            الاستبيان: <span className="text-blue-600">{survey.title}</span>
          </h1>
        </div>

        {/* ✅ واجهة خاصة بالاستبيان الخارجي */}
        {survey.type === "external" ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded p-6">
            <p className="mb-2 text-lg font-semibold">
              رابط الاستبيان الخارجي:
            </p>
            <a
              href={survey.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 break-all text-base"
            >
              {survey.url}
            </a>
          </div>
        ) : (
          <>
            {/* ✅ العمليات والإجراءات للاستبيان الداخلي */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Link
                  href={`/hr/surveys/${survey.id}/questions/create`}
                  className={`px-4 py-2 rounded text-sm font-medium text-white transition ${
                    isStarted()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  title={isStarted() ? "انتبه! الاستبيان قد بدء" : ""}
                >
                  + إضافة سؤال
                </Link>
                <Link
                  href={`/hr/surveys/responses/${survey.id}`}
                  className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  عرض الإجابات
                </Link>
              </div>
            </div>

            {/* ✅ جدول الأسئلة */}
            <div className="overflow-x-auto rounded border border-gray-200">
              <table className="w-full text-sm text-right text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-3 border">#</th>
                    <th className="p-3 border">النص</th>
                    <th className="p-3 border">النوع</th>
                    <th className="p-3 border">مطلوب</th>
                    <th className="p-3 border">الخيارات</th>
                    <th className="p-3 border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {survey.questions.length > 0 ? (
                    survey.questions
                      .sort((a, b) => a.order - b.order)
                      .map((q) => (
                        <tr key={q.id} className="bg-white hover:bg-gray-50">
                          <td className="p-3 border text-center">{q.order}</td>
                          <td className="p-3 border">{q.question_text}</td>
                          <td className="p-3 border">{q.question_type}</td>
                          <td className="p-3 border">
                            {q.required ? "نعم" : "لا"}
                          </td>
                          <td className="p-3 border">
                            {q.options?.length ? q.options.join(", ") : "—"}
                          </td>
                          <td className="p-3 border space-x-2 whitespace-nowrap">
                            <Link
                              href={`/hr/surveys/${survey.id}/questions/edit/${q.id}`}
                              className={`text-sm underline ${
                                isStarted()
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                              title={
                                isStarted()
                                  ? "لا يمكن تعديل الأسئلة بعد بدء الاستبيان"
                                  : "تعديل السؤال"
                              }
                            >
                              تعديل
                            </Link>
                            <button
                              onClick={() =>
                                !isStarted() && handleDeleteQuestion(q.id)
                              }
                              className={`text-sm underline ${
                                isStarted()
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-600 hover:text-red-800"
                              }`}
                              title={
                                isStarted()
                                  ? "لا يمكن حذف الأسئلة بعد بدء الاستبيان"
                                  : "حذف السؤال"
                              }
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        لا توجد أسئلة مضافة بعد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

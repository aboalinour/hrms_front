"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function SurveyResponsesPage() {
  const { id } = useParams();
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await api.get(`/survey-responses/${id}`);
        setResponse(res.data.data);
      } catch (err) {
        console.error("خطأ في جلب الإجابات:", err);
        setError("حدث خطأ أثناء جلب الإجابات.");
      }
    };

    fetchResponses();
  }, [id]);

  const renderAnswer = (value: string, type: string, fileUrl?: string) => {
    if (type === "file" && fileUrl) {
      return (
        <div className="space-y-2 mt-1">
          <p className="text-gray-700 font-semibold">📌 الإجابة:</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            📎 فتح الملف في نافذة جديدة
          </a>
        </div>
      );
    }

    if (type === "multi_choice" && value.startsWith("[")) {
      try {
        const choices = JSON.parse(value);
        return (
          <div className="mt-1">
            <p className="text-gray-700 font-semibold">📌 الإجابة:</p>
            <ul className="list-disc list-inside text-gray-800 mt-1">
              {choices.map((choice: string, index: number) => (
                <li key={index}>{choice}</li>
              ))}
            </ul>
          </div>
        );
      } catch {
        return <p className="text-gray-800">📌 الإجابة: {value}</p>;
      }
    }

    if (type === "boolean") {
      return (
        <p className="text-gray-800">
          📌 الإجابة: {value === "true" ? "نعم ✅" : "لا ❌"}
        </p>
      );
    }

    return (
      <p className="text-gray-800 whitespace-pre-line">📌 الإجابة: {value}</p>
    );
  };

  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!response)
    return <div className="text-center mt-6">جارٍ تحميل الإجابات...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        إجابات الاستبيان
      </h1>

      <div className="space-y-6">
        {response.answers.map((answer: any) => (
          <div
            key={answer.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
          >
            <div className="mb-3">
              <p className="text-gray-700 font-semibold">📝 السؤال:</p>
              <p className="text-gray-900">{answer.question?.text}</p>
            </div>

            <div>{renderAnswer(answer.answer, answer.question?.type, answer.file)}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/employee/surveys"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← العودة لقائمة الاستبيانات
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios"; // ✅ استخدام API الموحد

export default function SurveyResponsesPage() {
  const { id } = useParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await api.get(`/survey-responses?survey_id=${id}`);
        setResponses(res.data.data);
      } catch (err) {
        console.error("خطأ في جلب الإجابات:", err);
        setError("حدث خطأ أثناء جلب الإجابات.");
      }
    };

    fetchResponses();
  }, [id]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (responses.length === 0)
    return <div className="text-gray-600">لا توجد إجابات لهذا الاستبيان.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">إجابات الاستبيان</h1>

      {responses.map((response: any) => (
        <div
          key={response.id}
          className="bg-gray-100 rounded p-4 mb-6 shadow-sm"
        >
          <p className="text-gray-700 font-medium">
            👤 اسم الموظف:{" "}
            <span className="font-semibold text-black">
              {response.user_name || "غير معروف"}
            </span>
          </p>
          <p className="text-gray-700">
            ⏰ تم الإرسال في:{" "}
            <span className="text-gray-900">{response.created_at}</span>
          </p>

          <div className="space-y-4 mt-4">
            {response.answers.map((answer: any) => (
              <div
                key={answer.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
              >
                <p className="font-medium text-gray-800 mb-1">📝 السؤال:</p>
                <p className="text-gray-900 mb-2">{answer.question?.text}</p>

                <p className="font-medium text-gray-800 mb-1">📌 الإجابة:</p>
                {renderAnswer(answer.answer, answer.question?.type)}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Link
        href={`/hr/surveys/${id}/details`}
        className="inline-block mt-6 text-blue-600 hover:text-blue-800 underline"
      >
        ← العودة لتفاصيل الاستبيان
      </Link>
    </div>
  );
}

// ⭐️ دالة لعرض الإجابة حسب نوع السؤال
function renderAnswer(value: string, type: string) {
  if (type === "file" && value) {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
      <a
        href={`${backendURL}storage/${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        تحميل الملف
      </a>
    );
  }

  if (type === "multi_choice" && value.startsWith("[")) {
    try {
      const choices = JSON.parse(value);
      return (
        <ul className="list-disc list-inside pl-5">
          {choices.map((choice: string, index: number) => (
            <li key={index} className="text-gray-800">
              {choice}
            </li>
          ))}
        </ul>
      );
    } catch {
      return <p>{value}</p>;
    }
  }

  if (type === "boolean") {
    return <p>{value === "true" ? "نعم ✅" : "لا ❌"}</p>;
  }

  return <p className="text-gray-800">{value}</p>;
}

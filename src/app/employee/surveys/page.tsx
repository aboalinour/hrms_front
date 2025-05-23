"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios"; // ✅ استخدام النسخة المُعدلة من axios

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await api.get("/surveys"); // ✅ بدون الحاجة لكتابة full URL
        setSurveys(response.data.data);
      } catch (err) {
        console.error("خطأ في جلب الاستبيانات:", err);
        setError("حدث خطأ أثناء جلب الاستبيانات.");
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        قائمة الاستبيانات
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {surveys.length === 0 ? (
        <p className="text-gray-600 text-sm">لا توجد استبيانات حالياً.</p>
      ) : (
        <div className="space-y-4">
          {surveys.map((survey: any) => (
            <div
              key={survey.id}
              className="border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {survey.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{survey.description}</p>

              <div className="flex flex-wrap gap-4 mt-4">
                {!survey.survey_response_id ? (
                  <Link
                    href={`/employee/surveys/${survey.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ابدأ الإجابة على الاستبيان →
                  </Link>
                ) : (
                  <span
                    className="text-sm text-gray-400 cursor-not-allowed"
                    title="لا يمكنك الإجابة أكثر من مرة على الإستبيان"
                  >
                    ابدأ الإجابة على الاستبيان →
                  </span>
                )}

                {survey.survey_response_id && (
                  <Link
                    href={`/employee/surveys/responses/${survey.survey_response_id}`}
                    className="text-sm text-green-600 hover:text-green-800 transition-colors"
                  >
                    عرض الإجابات
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios"; // ✅ استبدال axios بـ api المعد مسبقاً

export default function SurveyAnswerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await api.get(`/surveys/${id}`);
        setSurvey(response.data.data);
      } catch (err) {
        console.error("فشل في تحميل الاستبيان:", err);
        setError("فشل في تحميل الاستبيان.");
      }
    };

    if (id) fetchSurvey();
  }, [id]);

  const handleChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFileChange = (questionId: number, file: File | null) => {
    setAnswers((prev) => ({ ...prev, [questionId]: file }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/survey-responses`, { survey_id: id });
      const responseId = response.data.data.id;

      const formData = new FormData();

      survey.questions.forEach((question: any, index: number) => {
        const questionId = question.id;
        const answerValue = answers[questionId];

        formData.append(`answers[${index}][survey_question_id]`, questionId.toString());

        if (question.question_type === "file" && answerValue instanceof File) {
          formData.append(`answers[${index}][file]`, answerValue);
        } else if (question.question_type === "multiple_boolean" && Array.isArray(answerValue)) {
          answerValue.forEach((val: string, i: number) => {
            formData.append(`answers[${index}][answer][${i}]`, val);
          });
        } else {
          formData.append(`answers[${index}][answer]`, answerValue ?? "");
        }
      });

      await api.post(`/survey-responses/${responseId}/answers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("تم إرسال الإجابات بنجاح!");
      router.push("/employee/surveys");
    } catch (err: any) {
      console.error("خطأ في إرسال الإجابات:", err);
      alert(err.response?.data?.message || "فشل في إرسال الإجابات.");
    }
  };

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!survey) return <div className="text-center mt-6">جاري التحميل...</div>;

  if (survey.type === "external") {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{survey.title}</h1>
        <p className="text-gray-600 mb-6">{survey.description}</p>

        <button
          onClick={() => {
            const url = survey.url?.startsWith("http")
              ? survey.url
              : `https://${survey.url}`;
            url ? window.open(url, "_blank") : alert("رابط غير متوفر");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded"
        >
          الانتقال إلى رابط الاستبيان
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{survey.title}</h1>
      <p className="text-gray-600 mb-6">{survey.description}</p>

      <div className="space-y-6">
        {survey.questions.map((question: any) => (
          <div key={question.id}>
            <label className="block font-medium text-gray-800 mb-2">
              {question.question_text}
              {question.required && <span className="text-red-500"> *</span>}
            </label>
            <div>{renderInput(question, answers, handleChange, handleFileChange)}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded mt-8"
      >
        إرسال الإجابات
      </button>
    </div>
  );
}

// 🔧 مكون مساعد لرسم حقل الإدخال المناسب حسب نوع السؤال
function renderInput(
  question: any,
  answers: any,
  handleChange: (id: number, value: any) => void,
  handleFileChange: (id: number, file: File | null) => void
) {
  switch (question.question_type) {
    case "text":
      return (
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => handleChange(question.id, e.target.value)}
        />
      );
    case "rating":
      return (
        <input
          type="number"
          min={1}
          max={10}
          className="w-full border rounded px-3 py-2"
          onChange={(e) => handleChange(question.id, Number(e.target.value))}
        />
      );
    case "boolean":
      return (
        <select
          className="w-full border rounded px-3 py-2"
          onChange={(e) => handleChange(question.id, e.target.value)}
        >
          <option value="">اختر</option>
          <option value="true">نعم</option>
          <option value="false">لا</option>
        </select>
      );
    case "multiple_choice":
      return (
        <select
          className="w-full border rounded px-3 py-2"
          onChange={(e) => handleChange(question.id, e.target.value)}
        >
          <option value="">اختر</option>
          {question.options.map((opt: string, index: number) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "multiple_boolean":
      return (
        <div className="flex flex-col gap-2">
          {question.options.map((opt: string, index: number) => (
            <label key={index} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                value={opt}
                onChange={(e) => {
                  const selected = answers[question.id] || [];
                  if (e.target.checked) {
                    handleChange(question.id, [...selected, opt]);
                  } else {
                    handleChange(
                      question.id,
                      selected.filter((v: string) => v !== opt)
                    );
                  }
                }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    case "range":
      return (
        <input
          type="range"
          min="0"
          max="100"
          onChange={(e) => handleChange(question.id, Number(e.target.value))}
        />
      );
    case "date":
      return (
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => handleChange(question.id, e.target.value)}
        />
      );
    case "file":
      return (
        <input
          type="file"
          className="w-full border rounded px-3 py-2"
          onChange={(e) =>
            handleFileChange(question.id, e.target.files?.[0] || null)
          }
        />
      );
    default:
      return (
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => handleChange(question.id, e.target.value)}
        />
      );
  }
}

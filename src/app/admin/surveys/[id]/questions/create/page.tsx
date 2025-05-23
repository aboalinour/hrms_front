'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

type QuestionForm = {
  question_text: string;
  question_type: string;
  required: boolean;
  options: string[];
  file: File | null;
  order: number | null;
};

export default function SurveyQuestionsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);

  const [form, setForm] = useState<QuestionForm>({
    question_text: "",
    question_type: "text",
    required: true,
    options: [""],
    file: null,
    order: null,
  });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/surveys/${id}/questions`)
      .then((res) => setQuestions(res.data.data))
      .catch(console.error);
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).files?.[0] || null,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("question_text", form.question_text);
      formData.append("question_type", form.question_type);
      formData.append("required", form.required ? "1" : "0");
      if (form.order !== null) formData.append("order", String(form.order));
      if (
        ["multiple_choice", "multiple_boolean"].includes(form.question_type)
      ) {
        form.options.forEach((opt) => formData.append("options[]", opt));
      }
      if (form.question_type === "file" && form.file) {
        formData.append("file", form.file);
      }

      await api.post(`/surveys/${id}/questions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("تم حفظ السؤال بنجاح!");

      // إعادة تعيين الفورم
      setForm({
        question_text: "",
        question_type: "text",
        required: true,
        options: [""],
        file: null,
        order: null,
      });

      // تحديث الأسئلة من جديد
      const res = await api.get(`/surveys/${id}/questions`);
      setQuestions(res.data.data);
    } catch (err: any) {
      console.error("Error:", err);
      if (err.response?.status === 422) {
        console.error("Validation errors:", err.response.data.errors);
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/admin/surveys/${id}/details`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة إلى تفاصيل الاستبيان
        </button>
        <h1 className="text-2xl font-bold text-gray-800">إضافة سؤال جديد</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100"
      >
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            نص السؤال:
          </label>
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">
            نوع السؤال:
          </label>
          <select
            name="question_type"
            value={form.question_type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="text">نصي</option>
            <option value="long_text">نصي طويل</option>
            <option value="multiple_choice">اختيارات</option>
            <option value="multiple_boolean">نعم/لا متعددة</option>
            <option value="rating">تقييم</option>
            <option value="boolean">نعم/لا</option>
            <option value="range">نطاق</option>
            <option value="date">تاريخ</option>
            <option value="file">ملف</option>
          </select>
        </div>

        {(form.question_type === "multiple_choice" ||
          form.question_type === "multiple_boolean") && (
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              الخيارات:
            </label>
            {form.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border border-gray-300 p-2 mb-2 rounded focus:ring-2 focus:ring-green-500"
                placeholder={`الخيار ${index + 1}`}
                required
              />
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-green-600 hover:underline mt-1"
            >
              + إضافة خيار
            </button>
          </div>
        )}

        <div>
          <label className="block font-medium mb-1 text-gray-700">
            الترتيب (اختياري):
          </label>
          <input
            type="number"
            name="order"
            value={form.order ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="checkbox"
            name="required"
            checked={form.required}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <span className="text-gray-700">هل هو مطلوب؟</span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition"
        >
          حفظ السؤال
        </button>
      </form>

      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-4">
        الأسئلة الحالية
      </h2>
      <ul className="space-y-3">
        {questions.map((q: any) => (
          <li
            key={q.id}
            className="p-4 border border-gray-200 rounded bg-white shadow-sm"
          >
            <div className="font-medium text-gray-800">{q.question_text}</div>
            <div className="text-sm text-gray-500 mt-1">
              النوع: {q.question_type} | مطلوب: {q.required ? "نعم" : "لا"}
              {q.options && q.options.length > 0 && (
                <div className="mt-1">الخيارات: {q.options.join(", ")}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

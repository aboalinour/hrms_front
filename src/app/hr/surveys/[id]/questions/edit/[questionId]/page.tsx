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

type Errors = {
  [key: string]: string[];
};

export default function EditSurveyQuestionPage() {
  const router = useRouter();
  const { id, questionId } = useParams();

  const [form, setForm] = useState<QuestionForm>({
    question_text: "",
    question_type: "text",
    required: false,
    options: [""],
    file: null,
    order: null,
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/surveys/${id}/questions/${questionId}`)
      .then((res) => {
        const q = res.data.data;
        setForm({
          question_text: q.question_text || "",
          question_type: q.question_type || "text",
          required: q.required || false,
          options: q.options || [""],
          file: null,
          order: q.order ?? null,
        });
      })
      .catch(() => setServerError("فشل في تحميل بيانات السؤال"))
      .finally(() => setLoading(false));
  }, [id, questionId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm((prev) => ({ ...prev, [name]: file }));
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
    setServerError(null);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("question_text", form.question_text);
      formData.append("question_type", form.question_type);
      formData.append("required", form.required ? "1" : "0");

      if (form.order !== null) {
        formData.append("order", String(form.order));
      }

      if (
        form.question_type === "multiple_choice" ||
        form.question_type === "multiple_boolean"
      ) {
        form.options.forEach((opt) => {
          formData.append("options[]", opt);
        });
      }

      if (form.question_type === "file" && form.file) {
        formData.append("file", form.file);
      }

      await api.post(
        `/surveys/${id}/questions/${questionId}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/hr/surveys");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 403) {
        setServerError("لا يمكن تعديل السؤال بعد بدء الاستبيان.");
      } else {
        setServerError("حدث خطأ أثناء حفظ التعديلات.");
      }
    }
  };

  if (loading) return <div className="p-6">جارٍ تحميل السؤال...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/hr/surveys/${id}/details`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة إلى تفاصيل الاستبيان
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">تعديل السؤال</h1>
      </div>

      {serverError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md border border-gray-200 rounded-lg p-6 space-y-5"
      >
        <div>
          <label className="block font-medium mb-1">نص السؤال:</label>
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            rows={3}
            required
          />
          {errors.question_text && (
            <p className="text-sm text-red-500 mt-1">
              {errors.question_text[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">نوع السؤال:</label>
          <select
            name="question_type"
            value={form.question_type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
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
            <label className="block font-medium mb-2">الخيارات:</label>
            {form.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border border-gray-300 p-2 mb-2 rounded"
              />
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 hover:underline"
            >
              + إضافة خيار
            </button>
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">الترتيب (اختياري):</label>
          <input
            type="number"
            name="order"
            value={form.order ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="required"
            checked={form.required}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>هل هو مطلوب؟</span>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded shadow w-full"
          >
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}

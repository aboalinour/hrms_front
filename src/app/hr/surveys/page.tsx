"use client";

import { useEffect, useState, Fragment } from "react";
import api from "@/lib/axios";
import Link from "next/link";

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  required: boolean;
  options?: string[];
  file?: string;
  order: number;
}

interface Department {
  id: number;
  name: string;
}

interface Survey {
  id: number;
  title: string;
  type: string;
  is_active: boolean;
  created_by: string;
  start_date: string;
  end_date: string;
  target_department?: Department;
  target_roles?: string[];
  questions: Question[];
}

export default function SurveyListPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    api
      .get("/surveys")
      .then((res) =>
        setSurveys(
          Array.isArray(res.data.data) ? res.data.data : [res.data.data]
        )
      )
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الاستبيان؟")) return;

    try {
      await api.delete(`/surveys/${id}`);
      setSurveys((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("خطأ أثناء الحذف:", error);
      alert("حدث خطأ أثناء محاولة حذف الاستبيان.");
    }
  };

  const isEditDisabled = (startDate: string | null) => {
    if (!startDate) return false;
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    return startDate <= today;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الاستبيانات</h1>
        <Link
          href="/hr/surveys/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + إضافة استبيان
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-right text-gray-800">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">العنوان</th>
              <th className="p-4">النوع</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">أنشئ بواسطة</th>
              <th className="p-4">تاريخ البداية</th>
              <th className="p-4">تاريخ النهاية</th>
              <th className="p-4">القسم المستهدف</th>
              <th className="p-4">الأدوار المستهدفة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <Fragment key={survey.id}>
                <tr className="hover:bg-gray-50 border-t">
                  <td className="p-4 font-medium">{survey.title}</td>
                  <td className="p-4">{survey.type}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        survey.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {survey.is_active ? "مفعل" : "معطل"}
                    </span>
                  </td>
                  <td className="p-4">{survey.created_by}</td>
                  <td className="p-4">{survey.start_date}</td>
                  <td className="p-4">{survey.end_date}</td>
                  <td className="p-4">
                    {survey.target_department?.name || "—"}
                  </td>
                  <td className="p-4">
                    {survey.target_roles?.length ? (
                      <span className="text-xs text-gray-700">
                        {survey.target_roles.join(", ")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4 space-x-2 text-center">
                    <Link
                      href={`/hr/surveys/${survey.id}/details`}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      التفاصيل
                    </Link>

                    <Link
                      href={`/hr/surveys/edite/${survey.id}`}
                      className={`text-sm ${
                        isEditDisabled(survey.start_date)
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:underline"
                      }`}
                      title={
                        isEditDisabled(survey.start_date)
                          ? "انتبه! الاستبيان قد بدء"
                          : ""
                      }
                    >
                      تعديل
                    </Link>

                    <button
                      onClick={() => handleDelete(survey.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

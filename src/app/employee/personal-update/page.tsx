'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function PersonalUpdatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    marital_status: "",
    number_of_children: "",
    qualification: "",
    phone: "",
    address: "",
    university: "",
    graduation_year: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("user/me")
      .then((res) => {
        const user = res.data.data;
        setFormData({
          marital_status: user.marital_status || "",
          number_of_children: user.number_of_children || "",
          qualification: user.qualification || "",
          phone: user.phone || "",
          address: user.address || "",
          university: user.university || "",
          graduation_year: user.graduation_year || "",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setError("");

    try {
      const res = await axios.put("/user/update", formData);
      setSuccessMsg(res.data.message);

      setTimeout(() => {
        router.push("/employee/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء تحديث البيانات الشخصية."
      );
    } finally {
      setLoading(false);
    }
  };

  // بيانات الحقول مع التسميات
  const fields = [
    { name: "marital_status", label: "الحالة الاجتماعية", type: "text" },
    { name: "number_of_children", label: "عدد الأطفال", type: "number" },
    { name: "qualification", label: "المؤهل العلمي", type: "text" },
    { name: "phone", label: "رقم الجوال", type: "text" },
    { name: "address", label: "العنوان", type: "text" },
    { name: "university", label: "الجامعة", type: "text" },
    { name: "graduation_year", label: "سنة التخرج", type: "text" },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        تحديث البيانات الشخصية
      </h2>

      {successMsg && (
        <p className="mb-6 text-green-600 border border-green-300 bg-green-50 rounded px-4 py-3">
          {successMsg}
        </p>
      )}
      {error && (
        <p className="mb-6 text-red-600 border border-red-300 bg-red-50 rounded px-4 py-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {fields.map(({ name, label, type }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="mb-1 font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              type={type}
              name={name}
              placeholder={label}
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "جاري التحديث..." : "تحديث البيانات"}
        </button>
      </form>
    </div>
  );
}

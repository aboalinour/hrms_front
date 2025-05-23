'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function CreateUserPageHR() {
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    name: "",
    email: "",
    job_number: "",
    department_id: "",
    status: "active",
    marital_status: "",
    number_of_children: "",
    qualification: "",
    phone: "",
    address: "",
    university: "",
    graduation_year: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");
        setDepartments(response.data.data);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب الأقسام");
      }
    };
    fetchDepartments();
  }, []);

  // **لأن هذه صفحة HR فقط، نمنع ظهور خيارات admin و hr**
  const roleOptions = [
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // **تحقق إضافي في حال تم التلاعب بالـ HTML أو devtools**
    if (formData.role === "admin" || formData.role === "hr") {
      setError("غير مسموح لك بتعيين دور Admin أو HR");
      setSaving(false);
      return;
    }

    const data = {
      ...formData,
      number_of_children: formData.number_of_children
        ? Number(formData.number_of_children)
        : null,
      department_id: formData.department_id || null,
      marital_status: formData.marital_status || null,
      qualification: formData.qualification || null,
      phone: formData.phone || null,
      address: formData.address || null,
      university: formData.university || null,
      graduation_year: formData.graduation_year || null,
    };

    try {
      await api.post("/user", data);
      router.push("/hr/employees");
    } catch (err) {
      console.error(err);
      setError("فشل في إنشاء المستخدم");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/hr/employees`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة لإدارة الموظفين
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          إضافة موظف جديد
        </h2>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* الأعمدة الأولى */}
        <div className="space-y-4">
          <Input
            label="اسم المستخدم"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="رقم الوظيفة"
            name="job_number"
            value={formData.job_number}
            onChange={handleChange}
            required
          />
          <Input
            label="الاسم"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Select
            label="الدور"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            options={roleOptions}
          />
          <Select
            label="الحالة"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            options={[
              { value: "active", label: "نشط" },
              { value: "suspended", label: "معلق" },
              { value: "resigned", label: "مستقيل" },
            ]}
          />
          <Select
            label="القسم"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            required
            options={
              departments.length
                ? departments.map((d) => ({
                    value: d.id.toString(),
                    label: d.name,
                  }))
                : [{ value: "", label: "لا توجد أقسام" }]
            }
          />
        </div>

        {/* الأعمدة الثانية */}
        <div className="space-y-4">
          <Input
            label="الحالة الاجتماعية"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
          />
          <Input
            label="عدد الأولاد"
            name="number_of_children"
            type="number"
            min={0}
            value={formData.number_of_children}
            onChange={handleChange}
          />
          <Input
            label="المؤهلات"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
          <Input
            label="رقم الهاتف"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            label="العنوان"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            label="الجامعة"
            name="university"
            value={formData.university}
            onChange={handleChange}
          />
          <Input
            label="سنة التخرج"
            name="graduation_year"
            value={formData.graduation_year}
            onChange={handleChange}
          />
        </div>

        {/* زر الإرسال */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg font-semibold"
          >
            {saving ? "جاري الإنشاء..." : "إنشاء المستخدم"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", ...rest }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        {...rest}
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options = [], ...rest }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 bg-white focus:outline-none focus:ring focus:border-blue-300"
        {...rest}
      >
        <option value="">-- اختر --</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

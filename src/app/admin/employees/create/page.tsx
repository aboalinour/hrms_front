'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Eye, EyeOff } from "lucide-react"; // 👈 استيراد الأيقونات

export default function CreateUserPage() {
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
    status: "",
    marital_status: "",
    number_of_children: "",
    qualification: "",
    phone: "",
    address: "",
    university: "",
    graduation_year: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // 👈 للحالة الجديدة
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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (profileImage) data.append("profile_image", profileImage);

      await api.post("/user", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/admin/employees");
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
          onClick={() => router.push(`/admin/employees`)}
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
        encType="multipart/form-data"
      >
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
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
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
            options={[
              { value: "admin", label: "Admin" },
              { value: "hr", label: "HR" },
              { value: "manager", label: "Manager" },
              { value: "employee", label: "Employee" },
            ]}
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
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              الصورة الشخصية
            </label>
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div> */}
        </div>

        <div className="space-y-4">
          <Select
            label="الحالة الاجتماعية"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            options={[
              { value: "single", label: "أعزب" },
              { value: "married", label: "متزوج" },
            ]}
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

// ✅ مكون الإدخال مع دعم زر العين
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  rightIcon = null,
  ...rest
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded p-2 pr-10 focus:outline-none focus:ring focus:border-blue-300"
          {...rest}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-2 flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
}

// ✅ مكون select موحد
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

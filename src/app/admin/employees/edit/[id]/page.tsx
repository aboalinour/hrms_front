'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Department {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
  department: string | null;
  status: string;
  marital_status: string | null;
  number_of_children: number | null;
  qualification: string | null;
  phone: string | null;
  address: string | null;
  university: string | null;
  graduation_year: string | null;
}

type FormData = {
  username: string;
  password: string;
  role: string;
  name: string;
  email: string;
  department: string; // هنا نحتفظ بـ ID القسم
  status: string;
  marital_status: string;
  number_of_children: string;
  qualification: string;
  phone: string;
  address: string;
  university: string;
  graduation_year: string;
};

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]); // قائمة الأقسام
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    role: "",
    name: "",
    email: "",
    department: "", // نحتفظ بـ ID القسم هنا
    status: "",
    marital_status: "",
    number_of_children: "",
    qualification: "",
    phone: "",
    address: "",
    university: "",
    graduation_year: "",
  });

  useEffect(() => {
    if (!id) return;

    // جلب بيانات المستخدم الحالي
    api
      .get<{ data: User }>(`/user/${id}`)
      .then(({ data }) => {
        const u = data.data;
        setFormData({
          username: u.username,
          password: "",
          role: u.roles[0] ?? "",
          name: u.name,
          email: u.email,
          department: u.department ?? "", // نضع الـ ID للقسم في formData.department
          status: u.status,
          marital_status: u.marital_status ?? "",
          number_of_children: u.number_of_children?.toString() ?? "",
          qualification: u.qualification ?? "",
          phone: u.phone ?? "",
          address: u.address ?? "",
          university: u.university ?? "",
          graduation_year: u.graduation_year ?? "",
        });
      })
      .catch(() => setError("فشل في جلب بيانات المستخدم"))
      .finally(() => setLoading(false));

    // جلب قائمة الأقسام
    api
      .get("/departments")
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data && Array.isArray(data.data)) {
          setDepartments(data.data); // إذا كانت الأقسام في data.data
        } else {
          setError("البيانات غير صحيحة أو غير مصفوفة");
        }
      })
      .catch(() => setError("فشل في جلب الأقسام"));
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/user/${id}`, {
        username: formData.username,
        ...(formData.password && { password: formData.password }),
        role: formData.role,
        name: formData.name,
        email: formData.email,
        department_id: formData.department || null, // إرسال الـ ID للقسم
        status: formData.status,
        marital_status: formData.marital_status || null,
        number_of_children: formData.number_of_children
          ? Number(formData.number_of_children)
          : null,
        qualification: formData.qualification || null,
        phone: formData.phone || null,
        address: formData.address || null,
        university: formData.university || null,
        graduation_year: formData.graduation_year || null,
      });
      router.push("/admin/employees");
    } catch {
      setError("فشل في تحديث البيانات");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">جارٍ تحميل البيانات…</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/admin/employees`)}
          className="text-sm text-blue-600 hover:underline"
        >
          العودة لإدارة الموظفين
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          تعديل بيانات الموظف
        </h2>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اسم المستخدم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور (اختياري)
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* الدور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الدور
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر دور</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* القسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              القسم
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر القسم</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* الحالة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحالة
            </label>
            <input
              name="status"
              type="text"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* الحالة الاجتماعية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحالة الاجتماعية
            </label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر الحالة الاجتماعية</option>
              <option value="أعزب">أعزب</option>
              <option value="متزوج">متزوج</option>
            </select>
          </div>

          {/* عدد الأولاد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عدد الأولاد
            </label>
            <input
              name="number_of_children"
              type="number"
              min={0}
              value={formData.number_of_children}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* المؤهل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المؤهل
            </label>
            <input
              name="qualification"
              type="text"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* الهاتف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* العنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العنوان
            </label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* الجامعة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الجامعة
            </label>
            <input
              name="university"
              type="text"
              value={formData.university}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* سنة التخرج */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              سنة التخرج
            </label>
            <input
              name="graduation_year"
              type="text"
              value={formData.graduation_year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}

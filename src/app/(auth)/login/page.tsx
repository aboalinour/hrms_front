'use client';
export const dynamic = 'force-dynamic';


import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Eye, EyeOff } from "lucide-react"; // ← إضافة أيقونات

interface Credentials {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", credentials);
      const token = res.data.token;
      const user = res.data.user;
      const role = res.data.role || user?.roles?.[0]?.name || "employee";

      if (!token || !user) throw new Error("الرد غير مكتمل");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/`;

      switch (role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "hr":
          router.push("/hr/dashboard");
          break;
        case "manager":
          router.push("/manager/dashboard");
          break;
        default:
          router.push("/employee/dashboard");
      }
    } catch (err: unknown) {
      console.error("🔴 Login Error:", err);
      setError("فشل تسجيل الدخول. تأكد من صحة البيانات.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10"
      >
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Logo" className="w-24 h-24 mb-2" />
          <p className="text-sm text-gray-600 font-semibold text-center">
            وزارة النقل – نظام إدارة الموارد البشرية
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-green-700 mb-6 tracking-wide">
          تسجيل الدخول إلى حسابك
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm">
            اسم المستخدم
          </label>
          <input
            type="text"
            placeholder="اسم المستخدم"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-1 text-sm">
            كلمة المرور
          </label>
          <input
            type={showPassword ? "text" : "password"} // 👈
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          تسجيل الدخول
        </button>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-green-700 hover:underline"
          >
            نسيت كلمة المرور؟
          </a>
        </div>
      </form>
    </div>
  );
}

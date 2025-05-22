"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { FiUser, FiBell } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    username: string;
    job_number: string;
  } | null>(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.clear();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b text-right">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">
        نظام الموارد البشرية
      </h1>

      <div className="flex items-center gap-6">
        {/* إشعارات */}
        <div className="relative">
          <button
            className="text-gray-700 hover:text-blue-600 transition text-2xl"
            title="الإشعارات"
          >
            <FiBell />
          </button>
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow">
            3
          </span>
        </div>

        {/* المستخدم */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
          >
            <FiUser className="text-2xl" />
            <span className="hidden sm:inline text-sm font-medium">
              {user?.name || "المستخدم"}
            </span>
          </button>

          {/* القائمة المنسدلة */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 text-sm space-y-2">
              <div>
                <p className="font-semibold text-gray-800">👤 {user?.name}</p>
                <p className="text-gray-600 mt-1">
                  اسم المستخدم:{" "}
                  <span className="font-medium">{user?.username}</span>
                </p>
                <p className="text-gray-600">
                  الرقم الوظيفي:{" "}
                  <span className="font-medium">{user?.job_number}</span>
                </p>
              </div>

              <hr className="border-gray-200" />

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

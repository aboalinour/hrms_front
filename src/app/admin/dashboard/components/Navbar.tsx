"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiBell } from "react-icons/fi";
import api from "@/lib/axios";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("");
  const [username, setUsername] = useState("");
  const [jobNumber, setJobNumber] = useState("");

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUserName(parsedUser.name);
      setUsername(parsedUser.username);
      setJobNumber(parsedUser.job_number);
    } else {
      fetchUser();
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/user/me");
      const data = response.data;
      setUserName(data.name);
      setUsername(data.username);
      setJobNumber(data.job_number);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("فشل في جلب بيانات المستخدم:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("فشل تسجيل الخروج:", error);
    } finally {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b text-right">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">
        نظام الموارد البشرية - Admin
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
              {userName || "المستخدم"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 text-sm space-y-2">
              <div>
                <p className="font-semibold text-gray-800">
                  👤 {userName || "اسم المستخدم"}
                </p>
                <p className="text-gray-600 mt-1">
                  اسم المستخدم:{" "}
                  <span className="font-medium">{username || "-"}</span>
                </p>
                <p className="text-gray-600">
                  الرقم الوظيفي:{" "}
                  <span className="font-medium">{jobNumber || "-"}</span>
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

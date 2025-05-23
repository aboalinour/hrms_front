"use client";

// src/app/employee/courses/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";

type Course = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  instructor: string;
  available: boolean;
  created_at: string;
};

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/course")
      .then((res) => setCourses(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        الدورات التدريبية المتاحة
      </h1>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {course.name}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                🧑‍🏫 المدرّب:{" "}
                <span className="font-medium">{course.instructor}</span>
              </p>

              <p className="text-sm text-gray-600 mb-1">
                🗓️ من <span className="font-medium">{course.start_date}</span>{" "}
                إلى <span className="font-medium">{course.end_date}</span>
              </p>

              <p className="text-sm text-gray-600 mb-1">
                📍 الموقع:{" "}
                <span className="font-medium">{course.location}</span>
              </p>

              <p className="text-gray-700 mt-2 mb-4 text-sm">
                {course.description.length > 120
                  ? `${course.description.slice(0, 120)}...`
                  : course.description}
              </p>

              <Link
                href={`/employee/requests/course-request/new?course_id=${course.id}`}
                className={`inline-block w-full text-center px-4 py-2 rounded transition text-white ${
                  course.available
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {course.available ? "تقديم طلب" : "غير متاحة حاليًا"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

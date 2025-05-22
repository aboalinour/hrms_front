'use client'

import { BookOpen } from 'lucide-react'

export default function CoursesCount() {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center justify-between">
      <div className="flex flex-col text-right">
        <p className="text-gray-600 text-sm">عدد الدورات التدريبية</p>
        <h2 className="text-2xl font-bold text-blue-600">24</h2> {/* لاحقاً نجلب الرقم من الـ API */}
      </div>

      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        <BookOpen size={28} />
      </div>
    </div>
  )
}

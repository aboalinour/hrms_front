"use client";

// src/app/employee/requests/my/page.tsx

import { useState } from 'react'
import LeaveRequestsTab from './components/LeaveRequestsTab'
import StatementRequestsTab from './components/StatementRequestsTab'
import CourseRequestsTab from './components/CourseRequestsTab'

const tabs = [
  { id: 'leave', label: 'طلبات الإجازة' },
  { id: 'statement', label: 'طلبات البيانات' },
  { id: 'course', label: 'طلبات الدورات' },
]

export default function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState('leave')

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">طلباتي السابقة</h1>

      <div className="flex gap-2 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'leave' && <LeaveRequestsTab />}
        {activeTab === 'statement' && <StatementRequestsTab />}
        {activeTab === 'course' && <CourseRequestsTab />}
      </div>
    </div>
  )
}

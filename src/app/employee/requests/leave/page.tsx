'use client';

import LeaveRequestForm from '@/app/employee/requests/leave/components/LeaveRequestForm';

export default function LeaveRequestPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">طلب إجازة جديد</h1>
      <LeaveRequestForm />
    </div>
  );
}

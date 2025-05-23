"use client";

import EmployeeTable from './components/UserTable'

export default function EmployeesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">إدارة الموظفين</h1>
      <EmployeeTable />
    </div>
  )
}

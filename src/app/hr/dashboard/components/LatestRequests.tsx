'use client'

import { CheckCircle, Clock, XCircle } from 'lucide-react'

const requests = [
  {
    id: 1,
    employee: 'أحمد محمد',
    type: 'طلب إجازة',
    status: 'approved',
    date: '2025-04-25',
  },
  {
    id: 2,
    employee: 'سارة أحمد',
    type: 'طلب بيان',
    status: 'pending',
    date: '2025-04-24',
  },
  {
    id: 3,
    employee: 'خالد يوسف',
    type: 'طلب دورة',
    status: 'rejected',
    date: '2025-04-23',
  },
]

export default function LatestRequests() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">آخر الطلبات</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">الموظف</th>
              <th className="p-2">نوع الطلب</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{req.employee}</td>
                <td className="p-2">{req.type}</td>
                <td className="p-2">
                  <StatusBadge status={req.status} />
                </td>
                <td className="p-2">{new Date(req.date).toLocaleDateString('ar-EG')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <CheckCircle size={16} /> موافقة
        </span>
      )
    case 'pending':
      return (
        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
          <Clock size={16} /> قيد المراجعة
        </span>
      )
    case 'rejected':
      return (
        <span className="flex items-center gap-1 text-red-600 font-semibold">
          <XCircle size={16} /> مرفوض
        </span>
      )
    default:
      return null
  }
}

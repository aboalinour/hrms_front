// src/app/admin/dashboard/components/DashboardCard.tsx

import { ReactNode } from 'react'

export default function DashboardCard({
  title,
  icon,
  value,
  color,
}: {
  title: string
  icon: ReactNode
  value: string | number
  color: string
}) {
  return (
    <div className={`flex items-center p-4 rounded shadow text-white ${color}`}>
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

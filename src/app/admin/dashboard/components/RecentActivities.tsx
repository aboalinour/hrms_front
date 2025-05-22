'use client'

const activities = [
  { id: 1, text: 'أحمد محمد قدم طلب دورة', time: 'قبل 3 ساعات' },
  { id: 2, text: 'سارة أحمد طلبت بيان وضع', time: 'قبل 5 ساعات' },
  { id: 3, text: 'خالد يوسف طلب إجازة مرضية', time: 'قبل يوم واحد' },
  { id: 4, text: 'محمود عبد الله رفع مرفق جديد', time: 'قبل يومين' },
  { id: 5, text: 'فاطمة الزهراء طلبت إجازة سنوية', time: 'قبل 3 أيام' },
  { id: 6, text: 'أحمد علي طلب دورة خارجية', time: 'قبل 4 أيام' },
  { id: 7, text: 'خديجة عمر طلبت بيان مالي', time: 'قبل 5 أيام' },
  { id: 8, text: 'أنس خالد قدم استقالة', time: 'قبل 6 أيام' },
  { id: 9, text: 'نور الهدى سجلت في دورة', time: 'قبل أسبوع' },
  { id: 10, text: 'زيد محمد عدل بياناته', time: 'قبل أسبوع' },
  { id: 11, text: 'محمد عمر أرسل ملاحظة', time: 'قبل أسبوعين' },
]

export default function RecentActivities() {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">الأنشطة الحديثة</h2>

      <div className="flex flex-col gap-3">
        {activities.length > 0 ? (
          activities.slice(0, 10).map((activity) => ( // ✅ نعرض فقط أول 10 عناصر
            <div key={activity.id} className="flex justify-between items-center border-b pb-2 last:border-none">
              <div className="text-gray-700 text-sm">{activity.text}</div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center">لا توجد أنشطة حديثة</p>
        )}
      </div>
    </div>
  )
}

'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import api from "@/lib/axios";

interface Request {
  id: string;
  type: string;
  status: string;
  created_at: string;
  subtype?: string;
  custom_course_title?: string;
  course_name?: string;
  user_name?: string;
}

interface FilterState {
  status: string;
  date: string;
}

function RequestRow({ request, onApprove, onReject, onShowDetails }: any) {
  const displayName = request.subtype || request.type;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 border-b">{displayName}</td>
      <td className="px-6 py-4 border-b">{request.status}</td>
      <td className="px-6 py-4 border-b">
        {dayjs(request.created_at).format("YYYY-MM-DD")}
      </td>
      <td className="px-6 py-4 border-b">{request.user_name || "غير معروف"}</td>
      <td className="px-6 py-4 border-b">
        <button
          onClick={() => onShowDetails(request.id)}
          className="btn btn-sm bg-blue-600 text-white mr-2"
        >
          تفاصيل
        </button>
        <button
          onClick={() => onApprove(request.id)}
          className="btn btn-sm bg-green-600 text-white mr-2"
        >
          موافقة
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="btn btn-sm bg-red-600 text-white"
        >
          رفض
        </button>
      </td>
    </tr>
  );
}

function debounce<Func extends (...args: any[]) => void>(
  func: Func,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function ManagerRequestsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterState>({ status: "", date: "" });
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const fetchRequests = async (filters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const res = await api.get("/leave-requests", { params });
      setRequests(res.data.data || []);
    } catch (err) {
      setError("فشل في تحميل الطلبات.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchRequests, 500), []);
  useEffect(() => debouncedFetch(filter), [filter, debouncedFetch]);

  const handleApprove = async (id: string) => {
    await api.post(`/leave-requests/${id}/approve`, { status: "approved" });
    fetchRequests(filter);
  };

  const handleReject = async (id: string) => {
    const comment = prompt("سبب الرفض؟");
    if (!comment) return;
    await api.post(`/leave-requests/${id}/approve`, {
      status: "rejected",
      comment,
    });
    fetchRequests(filter);
  };

  const handleShowDetails = (id: string) => {
    router.push(`/manager/requests/details/leave/${id}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">طلبات الإجازة</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">الحالة</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">موافقة</option>
          <option value="rejected">مرفوضة</option>
        </select>

        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      {loading && <p>جاري التحميل...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">النوع</th>
            <th className="px-4 py-2">الحالة</th>
            <th className="px-4 py-2">التاريخ</th>
            <th className="px-4 py-2">الموظف</th>
            <th className="px-4 py-2">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
              onShowDetails={handleShowDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

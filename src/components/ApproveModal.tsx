// src/components/ApproveModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import api from "@/lib/axios";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "leave" | "statement" | "course";
  requestId: string;
  onSuccess?: () => void;
}

interface FormValues {
  attachment?: FileList;
  link?: string;
  comment?: string;
}

export default function ApproveModal({
  isOpen,
  onClose,
  type,
  requestId,
  onSuccess,
}: ApproveModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    if (type === "statement") {
      if (!data.attachment?.[0]) return alert("يجب رفع مرفق البيان");
      formData.append("attachment", data.attachment[0]);
    }

    if (type === "course") {
      if (!data.attachment?.[0] && !data.link)
        return alert("يجب رفع مرفق أو إدخال رابط الدورة");
      if (data.attachment?.[0])
        formData.append("attachment", data.attachment[0]);
      if (data.link) formData.append("link", data.link);
    }

    if (data.comment) formData.append("comment", data.comment);

    setSubmitting(true);
    try {
      await api.post(`/${type}-requests/${requestId}/approve`, formData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("فشل في الموافقة", error);
      alert("فشل في الموافقة على الطلب.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            موافقة على الطلب
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {type === "statement" && (
              <div>
                <label className="block mb-1 font-semibold">
                  مرفق البيان (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  {...register("attachment")}
                />
              </div>
            )}

            {type === "course" && (
              <>
                <div>
                  <label className="block mb-1 font-semibold">
                    رابط الدورة (اختياري)
                  </label>
                  <input
                    type="url"
                    {...register("link")}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    مرفق الدورة (PDF اختياري)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    {...register("attachment")}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-1 font-semibold">
                تعليق (اختياري)
              </label>
              <textarea
                {...register("comment")}
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {submitting ? "...يتم الإرسال" : "تأكيد الموافقة"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

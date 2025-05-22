// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import Link from "next/link";

// export default function SurveyResponsesPage() {
//   const { id } = useParams();
//   const [responses, setResponses] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/survey-responses/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               Accept: "application/json",
//             },
//           }
//         );
//         setResponses(response.data.data);
//       } catch (err) {
//         console.error("فشل في جلب البيانات", err);
//         setError("حدث خطأ أثناء جلب الإجابات.");
//       }
//     };

//     if (id) fetchResponses();
//   }, [id]);

//   if (error) return <div className="text-red-500">{error}</div>;
//   if (!responses) return <div>جاري التحميل...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">
//         إجابات الاستبيان رقم {responses.survey_id}
//       </h1>

//       <div className="space-y-4">
//         {responses.answers.map((answer: any) => (
//           <div key={answer.id} className="p-4 border rounded shadow">
//             <p className="font-semibold">
//               السؤال رقم {answer.survey_question_id}:
//             </p>
//             {answer.answer.endsWith(".pdf") ||
//             answer.answer.includes("survey_files") ? (
//               <a
//                 href={`http://127.0.0.1:8000/storage/${answer.answer}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 عرض الملف المرفق
//               </a>
//             ) : (
//               <p className="text-gray-700">
//                 {Array.isArray(answer.answer)
//                   ? answer.answer.join(", ")
//                   : answer.answer}
//               </p>
//             )}
//             <p className="text-sm text-gray-400 mt-1">
//               بتاريخ: {new Date(answer.created_at).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       <Link
//         href="/employee/surveys"
//         className="block mt-6 text-blue-600 hover:underline"
//       >
//         ← الرجوع لقائمة الاستبيانات
//       </Link>
//     </div>
//   );
// }

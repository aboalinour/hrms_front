"use client";
// src/app/admin/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-white">Sidebar هنا</aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}

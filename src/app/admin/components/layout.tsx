"use client";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  navbar?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
  sidebar,
  navbar,
  footer,
}: AdminDashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-right w-full">
      {/* ✅ sidebar كعنصر JSX مباشر */}
      <div className="transition-all duration-300">{sidebar}</div>

      <div className="flex-1 flex flex-col">
        {navbar}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        {footer}
      </div>
    </div>
  );
}

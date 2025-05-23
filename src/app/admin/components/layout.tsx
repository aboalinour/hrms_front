"use client";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
  sidebar,
  navbar,
  footer,
}: AdminDashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <aside className="w-64">{sidebar}</aside>

      <div className="flex-1 flex flex-col">
        {navbar}
        <main className="flex-1 p-6">{children}</main>
        {footer}
      </div>
    </div>
  );
}

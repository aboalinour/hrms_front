export default function ManagerFooter() {
  return (
    <footer className="w-full border-t bg-white py-4 text-center text-sm text-gray-500 shadow-inner">
      <p className="tracking-tight font-medium">
        © {new Date().getFullYear()} إدارة الموارد البشرية – لوحة المدير
      </p>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-4 text-center text-sm text-gray-500 shadow-inner">
      <p className="tracking-tight font-medium">
        © {new Date().getFullYear()} وزارة النقل – نظام إدارة الموارد البشرية
      </p>
    </footer>
  );
}

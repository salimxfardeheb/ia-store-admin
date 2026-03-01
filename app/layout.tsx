import "./globals.css";

import AdminSidebar from "./components/AdminSidebar";

export const metadata = { title: "Admin — I.A Store" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex bg-[#F7F7F7]">
          <AdminSidebar />
          <main className="flex-1 ml-56 p-8 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}

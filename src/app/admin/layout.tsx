import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - CTF Platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
      </div>
      {children}
    </div>
  );
}

import AdminSidebar from "./AdminSidebar";
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#fff8ee] lg:flex"><AdminSidebar/><div className="min-w-0 flex-1"><header className="border-b border-[#eadfd2] bg-white px-4 py-4 sm:px-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#6d625a]">Restaurant workspace</p><h1 className="font-extrabold text-[#6b4f3a]">Aai's Kitchen</h1></div><span className="badge-open rounded-full px-3 py-1 text-sm font-bold">Open</span></div></header><main className="p-4 sm:p-6">{children}</main></div></div>;
}

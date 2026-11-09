import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-100"}`;

export default function AdminLayout() {
    const { session, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
                    <Link to="/admin" className="text-lg font-bold text-slate-900">
                        <span className="text-violet-600">Help</span>Desk <span className="text-sm font-medium text-slate-400">Admin</span>
                    </Link>
                    <nav className="flex gap-1">
                        <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
                        <NavLink to="/admin/tickets" className={linkClass}>Tickets</NavLink>
                    </nav>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm text-slate-500">{session?.username}</span>
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}

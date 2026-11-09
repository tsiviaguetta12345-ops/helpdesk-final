import { Link, Outlet } from "react-router";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
                    <Link to="/" className="text-lg font-bold text-slate-900">
                        <span className="text-violet-600">Help</span>Desk
                    </Link>
                    <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-violet-600">
                        Admin area
                    </Link>
                </div>
            </header>
            <main className="mx-auto max-w-3xl px-4 py-10">
                <Outlet />
            </main>
        </div>
    );
}

import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 px-4 text-center">
            <p className="text-6xl font-bold text-violet-600">404</p>
            <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
            <Link to="/" className="font-medium text-violet-600 hover:underline">Back to the home page</Link>
        </div>
    );
}

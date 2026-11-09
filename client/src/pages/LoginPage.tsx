import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { login } from "../services/authApi";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/errors";
import ErrorMessage from "../components/ErrorMessage";

function readFrom(state: unknown): string {
    if (typeof state === "object" && state !== null && "from" in state) {
        const { from } = state as { from: unknown };
        if (typeof from === "string" && from.startsWith("/admin")) return from;
    }
    return "/admin";
}

export default function LoginPage() {
    const { session, saveSession } = useAuth();
    const navigate = useNavigate();
    const from = readFrom(useLocation().state);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (session !== null) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username.trim() === "" || password === "") {
            setError("Enter your username and password");
            return;
        }

        setIsSending(true);
        setError(null);
        try {
            saveSession(await login({ username: username.trim(), password }));
            navigate(from, { replace: true });
        } catch (failure) {
            setError(getErrorMessage(failure, "Login failed"));
        } finally {
            setIsSending(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-violet-500";

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin login</h1>
                    <p className="text-sm text-slate-500">Help Desk management area</p>
                </div>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Username
                    <input value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} autoComplete="username" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Password
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} autoComplete="current-password" />
                </label>
                {error !== null && <ErrorMessage message={error} />}
                <button type="submit" disabled={isSending} className="rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700 disabled:bg-slate-300">
                    {isSending ? "Logging in..." : "Log in"}
                </button>
                <Link to="/" className="text-center text-sm text-slate-500 hover:text-violet-600">Back to the public site</Link>
            </form>
        </div>
    );
}

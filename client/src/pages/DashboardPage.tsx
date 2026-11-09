import { Link } from "react-router";
import { useTickets } from "../hooks/useTickets";
import { formatDate } from "../utils/format";
import StatCard from "../components/StatCard";
import { PriorityBadge, StatusBadge } from "../components/Badges";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function DashboardPage() {
    const { tickets, isLoading, error } = useTickets();

    const count = (check: (status: string, priority: string) => boolean) =>
        tickets.filter((ticket) => check(ticket.status, ticket.priority)).length;

    const latest = tickets.slice(0, 5);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

            {isLoading && <Loading text="Loading tickets..." />}
            {error !== null && <ErrorMessage message={error} />}

            {!isLoading && error === null && (
                <>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                        <StatCard label="Total tickets" value={tickets.length} accent="text-slate-900" />
                        <StatCard label="Open" value={count((status) => status === "Open")} accent="text-sky-600" />
                        <StatCard label="In progress" value={count((status) => status === "In Progress")} accent="text-amber-600" />
                        <StatCard label="Closed" value={count((status) => status === "Closed")} accent="text-emerald-600" />
                        <StatCard label="High priority (not closed)" value={count((status, priority) => priority === "High" && status !== "Closed")} accent="text-red-600" />
                    </div>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Latest tickets</h2>
                            <Link to="/admin/tickets" className="text-sm font-medium text-violet-600 hover:underline">Manage all tickets →</Link>
                        </div>
                        {latest.length === 0 ? (
                            <p className="text-slate-500">No tickets yet.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {latest.map((ticket) => (
                                    <li key={ticket.id} className="flex flex-wrap items-center gap-3 py-3">
                                        <span className="w-full font-medium text-slate-900 sm:w-auto sm:min-w-0 sm:flex-1 sm:truncate">{ticket.title}</span>
                                        <span className="text-sm text-slate-500">{ticket.fullName}</span>
                                        <PriorityBadge priority={ticket.priority} />
                                        <StatusBadge status={ticket.status} />
                                        <span className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

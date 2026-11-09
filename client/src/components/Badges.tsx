import type { TicketPriority, TicketStatus } from "../types/ticket";

const statusStyles: Record<TicketStatus, string> = {
    "Open": "bg-sky-100 text-sky-700",
    "In Progress": "bg-amber-100 text-amber-800",
    "Closed": "bg-emerald-100 text-emerald-700"
};

const priorityStyles: Record<TicketPriority, string> = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-violet-100 text-violet-700",
    High: "bg-red-100 text-red-700"
};

const badgeClass = "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold";

export function StatusBadge({ status }: { status: TicketStatus }) {
    return <span className={`${badgeClass} ${statusStyles[status]}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
    return <span className={`${badgeClass} ${priorityStyles[priority]}`}>{priority}</span>;
}

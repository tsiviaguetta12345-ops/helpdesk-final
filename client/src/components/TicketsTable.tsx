import type { PublicTicket } from "../types/ticket";
import { formatDate, shortId } from "../utils/format";
import { PriorityBadge, StatusBadge } from "./Badges";
import TicketDetailsDialog from "./TicketDetailsDialog";
import DeleteTicketDialog from "./DeleteTicketDialog";

interface TicketsTableProps {
    tickets: PublicTicket[];
    onTicketUpdated: (ticket: PublicTicket) => void;
    onTicketDeleted: (id: string) => void;
}

export default function TicketsTable({ tickets, onTicketUpdated, onTicketDeleted }: TicketsTableProps) {
    if (tickets.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No tickets found
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-4 py-3">Ticket</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} className="align-top hover:bg-slate-50">
                            <td className="min-w-[200px] px-4 py-3">
                                <p className="font-medium text-slate-900">{ticket.title}</p>
                                <p className="text-xs text-slate-400">{shortId(ticket.id)}</p>
                            </td>
                            <td className="px-4 py-3">
                                <p className="text-slate-900">{ticket.fullName}</p>
                                <p className="text-xs text-slate-500">{ticket.email}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{ticket.category}</td>
                            <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
                            <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(ticket.createdAt)}</td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <TicketDetailsDialog ticketId={ticket.id} onTicketUpdated={onTicketUpdated} />
                                    <DeleteTicketDialog ticket={ticket} onTicketDeleted={onTicketDeleted} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import { Link, Navigate, useLocation } from "react-router";
import type { PublicTicket } from "../types/ticket";
import { shortId } from "../utils/format";

function readTicket(state: unknown): PublicTicket | null {
    if (typeof state === "object" && state !== null && "ticket" in state) {
        const { ticket } = state as { ticket: unknown };
        if (typeof ticket === "object" && ticket !== null && "id" in ticket && "title" in ticket) {
            return ticket as PublicTicket;
        }
    }
    return null;
}

export default function TicketCreatedPage() {
    const ticket = readTicket(useLocation().state);

    // Opened directly (no ticket was just sent): back to the form.
    if (ticket === null) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
            <h1 className="text-2xl font-bold text-slate-900">Your ticket was received</h1>
            <p className="text-slate-600">
                Ticket number <span className="font-semibold text-slate-900">{shortId(ticket.id)}</span> – "{ticket.title}".
            </p>
            <p className="text-slate-500">We will contact you at {ticket.email}.</p>
            <Link to="/" className="mt-2 rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700">
                Open another ticket
            </Link>
        </div>
    );
}

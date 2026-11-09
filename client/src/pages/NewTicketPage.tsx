import { useNavigate } from "react-router";
import type { PublicTicket } from "../types/ticket";
import TicketForm from "../components/TicketForm";

export default function NewTicketPage() {
    const navigate = useNavigate();

    // The confirmation page is opened only after the server saved the ticket.
    const handleCreated = (ticket: PublicTicket) => {
        navigate("/ticket-created", { state: { ticket } });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Open a service ticket</h1>
                <p className="mt-1 text-slate-500">Tell us about the problem and our team will get back to you.</p>
            </div>
            <TicketForm onTicketCreated={handleCreated} />
        </div>
    );
}

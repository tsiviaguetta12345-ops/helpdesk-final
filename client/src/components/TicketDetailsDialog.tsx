import { useState } from "react";
import { Dialog } from "radix-ui";
import type { PublicTicket, TicketPriority, TicketStatus } from "../types/ticket";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../types/ticket";
import { getTicketById, updateTicket } from "../services/ticketsApi";
import { useAuth } from "../hooks/useAuth";
import { formatDate, shortId } from "../utils/format";
import { getErrorMessage, isUnauthorized } from "../utils/errors";
import { PriorityBadge, StatusBadge } from "./Badges";
import SelectField from "./SelectField";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

interface TicketDetailsDialogProps {
    ticketId: string;
    onTicketUpdated: (ticket: PublicTicket) => void;
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="break-words text-slate-900">{value}</p>
        </div>
    );
}

export default function TicketDetailsDialog({ ticketId, onTicketUpdated }: TicketDetailsDialogProps) {
    const { logout } = useAuth();
    const [ticket, setTicket] = useState<PublicTicket | null>(null);
    const [status, setStatus] = useState<TicketStatus | "">("");
    const [priority, setPriority] = useState<TicketPriority | "">("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState<boolean>(false);

    const showTicket = (data: PublicTicket) => {
        setTicket(data);
        setStatus(data.status);
        setPriority(data.priority);
    };

    const handleError = (failure: unknown, fallback: string) => {
        if (isUnauthorized(failure)) {
            logout();
        } else {
            setError(getErrorMessage(failure, fallback));
        }
    };

    const loadTicket = async () => {
        setIsLoading(true);
        setError(null);
        try {
            showTicket(await getTicketById(ticketId));
        } catch (failure) {
            handleError(failure, "Failed to load the ticket");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            void loadTicket();
        } else {
            setTicket(null);
            setError(null);
            setSaved(false);
        }
    };

    const hasChanges = ticket !== null && (status !== ticket.status || priority !== ticket.priority);

    const handleSave = async () => {
        if (ticket === null || status === "" || priority === "") return;

        setIsSaving(true);
        setError(null);
        setSaved(false);
        try {
            const updated = await updateTicket(ticket.id, { status, priority });
            showTicket(updated);
            onTicketUpdated(updated);
            setSaved(true);
        } catch (failure) {
            handleError(failure, "Failed to update the ticket");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                View
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                        Ticket {shortId(ticketId)}
                    </Dialog.Title>
                    <Dialog.Description className="mb-4 text-sm text-slate-500">
                        Loaded from the server by id
                    </Dialog.Description>

                    {isLoading && <Loading text="Loading ticket..." />}
                    {error !== null && <ErrorMessage message={error} />}

                    {ticket !== null && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <StatusBadge status={ticket.status} />
                                    <PriorityBadge priority={ticket.priority} />
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{ticket.category}</span>
                                </div>
                            </div>

                            <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700">{ticket.description}</p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Detail label="Customer" value={ticket.fullName} />
                                <Detail label="Email" value={ticket.email} />
                                <Detail label="Phone" value={ticket.phone} />
                                <Detail label="Ticket id" value={ticket.id} />
                                <Detail label="Created" value={formatDate(ticket.createdAt)} />
                                <Detail label="Last update" value={formatDate(ticket.updatedAt)} />
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
                                <p className="font-semibold text-slate-900">Update ticket</p>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <SelectField label="Status" value={status} options={TICKET_STATUSES} onChange={(value) => { setStatus(value); setSaved(false); }} />
                                    <SelectField label="Priority" value={priority} options={TICKET_PRIORITIES} onChange={(value) => { setPriority(value); setSaved(false); }} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={!hasChanges || isSaving}
                                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
                                    >
                                        {isSaving ? "Saving..." : "Save changes"}
                                    </button>
                                    {saved && <span className="text-sm text-emerald-700">Saved</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <Dialog.Close className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                            Close
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

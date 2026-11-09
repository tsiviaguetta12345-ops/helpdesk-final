import type { CreateTicketInput, PublicTicket, UpdateTicketInput } from "../types/ticket";
import { downloadFile, sendRequest } from "./api";

export function createTicket(input: CreateTicketInput): Promise<PublicTicket> {
    return sendRequest<PublicTicket>("/tickets", "POST", input);
}

export function getTickets(): Promise<PublicTicket[]> {
    return sendRequest<PublicTicket[]>("/tickets");
}

export function getTicketById(id: string): Promise<PublicTicket> {
    return sendRequest<PublicTicket>(`/tickets/${id}`);
}

export function updateTicket(id: string, changes: UpdateTicketInput): Promise<PublicTicket> {
    return sendRequest<PublicTicket>(`/tickets/${id}`, "PATCH", changes);
}

export async function deleteTicket(id: string): Promise<void> {
    await sendRequest<{ id: string }>(`/tickets/${id}`, "DELETE");
}

export function exportTicketsCsv(): Promise<Blob> {
    return downloadFile("/tickets/export");
}

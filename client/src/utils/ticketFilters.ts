import type { PublicTicket, TicketFilterValues } from "../types/ticket";

export const noFilters: TicketFilterValues = { search: "", status: "All", priority: "All", category: "All" };

export function filterTickets(tickets: PublicTicket[], filters: TicketFilterValues): PublicTicket[] {
    const search = filters.search.trim().toLowerCase();

    return tickets.filter((ticket) => {
        if (filters.status !== "All" && ticket.status !== filters.status) return false;
        if (filters.priority !== "All" && ticket.priority !== filters.priority) return false;
        if (filters.category !== "All" && ticket.category !== filters.category) return false;
        if (search === "") return true;

        return [ticket.title, ticket.description, ticket.fullName, ticket.email, ticket.phone, ticket.id]
            .some((text) => text.toLowerCase().includes(search));
    });
}

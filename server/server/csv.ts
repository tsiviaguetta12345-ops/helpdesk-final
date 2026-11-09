import { PublicTicket } from "../type/ticket";

const HEADERS = [
    "Ticket ID", "Full Name", "Email", "Phone", "Title", "Description",
    "Category", "Priority", "Status", "Created At", "Updated At"
];

// Puts the value between quotes when needed and doubles the quotes inside it.
// A value starting with = + - @ gets a ' in front so Excel does not run it as a formula.
function csvCell(value: string): string {
    const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
    return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function ticketsToCsv(tickets: PublicTicket[]): string {
    const rows = tickets.map((ticket) => [
        ticket.id, ticket.fullName, ticket.email, ticket.phone, ticket.title, ticket.description,
        ticket.category, ticket.priority, ticket.status, ticket.createdAt, ticket.updatedAt
    ]);

    // The BOM at the start lets Excel read Hebrew letters correctly.
    return "﻿" + [HEADERS, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

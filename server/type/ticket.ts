import { ObjectId } from "mongodb";

export const TICKET_CATEGORIES = ["Hardware", "Software", "Network", "Account", "Other"] as const;
export const TICKET_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TICKET_STATUSES = ["Open", "In Progress", "Closed"] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

// What the public form sends to the server.
export interface CreateTicketInput {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
}

// What is saved in MongoDB.
export interface TicketDocument extends CreateTicketInput {
    _id?: ObjectId;
    status: TicketStatus;
    createdAt: Date;
    updatedAt: Date;
}

// What the server returns to the client.
export interface PublicTicket extends CreateTicketInput {
    id: string;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
}

// The only fields the administrator may change.
export interface UpdateTicketInput {
    status?: TicketStatus;
    priority?: TicketPriority;
}

export interface TicketIdParams {
    id: string;
}

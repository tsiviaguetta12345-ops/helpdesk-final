export const TICKET_CATEGORIES = ["Hardware", "Software", "Network", "Account", "Other"] as const;
export const TICKET_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TICKET_STATUSES = ["Open", "In Progress", "Closed"] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface CreateTicketInput {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
}

export interface PublicTicket extends CreateTicketInput {
    id: string;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTicketInput {
    status?: TicketStatus;
    priority?: TicketPriority;
}

// Form state: category and priority stay "" until the user chooses.
export interface TicketFormValues {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    category: TicketCategory | "";
    priority: TicketPriority | "";
}

export type TicketFormErrors = Partial<Record<keyof TicketFormValues, string>>;

// "All" means the filter is not used.
export interface TicketFilterValues {
    search: string;
    status: TicketStatus | "All";
    priority: TicketPriority | "All";
    category: TicketCategory | "All";
}

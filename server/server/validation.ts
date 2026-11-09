import {
    CreateTicketInput,
    TICKET_CATEGORIES,
    TICKET_PRIORITIES,
    TICKET_STATUSES,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    UpdateTicketInput
} from "../type/ticket";
import { LoginInput } from "../type/admin";

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{9,20}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFilledString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
    return typeof value === "string" && (list as readonly string[]).includes(value);
}

export function isTicketCategory(value: unknown): value is TicketCategory {
    return isOneOf(TICKET_CATEGORIES, value);
}

export function isTicketPriority(value: unknown): value is TicketPriority {
    return isOneOf(TICKET_PRIORITIES, value);
}

export function isTicketStatus(value: unknown): value is TicketStatus {
    return isOneOf(TICKET_STATUSES, value);
}

export function parseCreateTicketInput(body: unknown): ParseResult<CreateTicketInput> {
    if (!isRecord(body)) {
        return { ok: false, error: "The request body must be a JSON object" };
    }

    const { fullName, email, phone, title, description, category, priority } = body;

    if (!isFilledString(fullName) || !isFilledString(email) || !isFilledString(phone) ||
        !isFilledString(title) || !isFilledString(description)) {
        return { ok: false, error: "Full name, email, phone, title and description are required" };
    }

    const input: CreateTicketInput = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        title: title.trim(),
        description: description.trim(),
        category: "Other",
        priority: "Medium"
    };

    if (input.fullName.length < 2 || input.fullName.length > 80) {
        return { ok: false, error: "Full name must be between 2 and 80 characters" };
    }
    if (!EMAIL_PATTERN.test(input.email)) {
        return { ok: false, error: "Email address is not valid" };
    }
    if (!PHONE_PATTERN.test(input.phone)) {
        return { ok: false, error: "Phone number is not valid" };
    }
    if (input.title.length < 3 || input.title.length > 100) {
        return { ok: false, error: "Title must be between 3 and 100 characters" };
    }
    if (input.description.length < 10 || input.description.length > 2000) {
        return { ok: false, error: "Description must be between 10 and 2000 characters" };
    }
    if (!isTicketCategory(category)) {
        return { ok: false, error: `Category must be one of: ${TICKET_CATEGORIES.join(", ")}` };
    }
    if (!isTicketPriority(priority)) {
        return { ok: false, error: `Priority must be one of: ${TICKET_PRIORITIES.join(", ")}` };
    }

    input.category = category;
    input.priority = priority;
    return { ok: true, value: input };
}

export function parseUpdateTicketInput(body: unknown): ParseResult<UpdateTicketInput> {
    if (!isRecord(body)) {
        return { ok: false, error: "The request body must be a JSON object" };
    }

    const changes: UpdateTicketInput = {};

    if (body.status !== undefined) {
        if (!isTicketStatus(body.status)) {
            return { ok: false, error: `Status must be one of: ${TICKET_STATUSES.join(", ")}` };
        }
        changes.status = body.status;
    }

    if (body.priority !== undefined) {
        if (!isTicketPriority(body.priority)) {
            return { ok: false, error: `Priority must be one of: ${TICKET_PRIORITIES.join(", ")}` };
        }
        changes.priority = body.priority;
    }

    if (changes.status === undefined && changes.priority === undefined) {
        return { ok: false, error: "Send a status and/or a priority to update" };
    }

    return { ok: true, value: changes };
}

export function parseLoginInput(body: unknown): ParseResult<LoginInput> {
    if (!isRecord(body) || !isFilledString(body.username) || !isFilledString(body.password)) {
        return { ok: false, error: "Username and password are required" };
    }
    return { ok: true, value: { username: body.username.trim(), password: body.password } };
}

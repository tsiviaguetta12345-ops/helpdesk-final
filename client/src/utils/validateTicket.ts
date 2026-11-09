import type { CreateTicketInput, TicketFormErrors, TicketFormValues } from "../types/ticket";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{9,20}$/;

export type FormCheck =
    | { isValid: true; input: CreateTicketInput }
    | { isValid: false; errors: TicketFormErrors };

// Same rules as the server, so the user sees the problem before sending.
export function validateTicket(values: TicketFormValues): FormCheck {
    const errors: TicketFormErrors = {};
    const fullName = values.fullName.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const title = values.title.trim();
    const description = values.description.trim();

    if (fullName.length < 2 || fullName.length > 80) errors.fullName = "Enter your full name (2-80 characters)";
    if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
    if (!PHONE_PATTERN.test(phone)) errors.phone = "Enter a valid phone number (at least 9 digits)";
    if (title.length < 3 || title.length > 100) errors.title = "Title must be 3-100 characters";
    if (description.length < 10 || description.length > 2000) errors.description = "Describe the problem (10-2000 characters)";
    if (values.category === "") errors.category = "Choose a category";
    if (values.priority === "") errors.priority = "Choose a priority";

    if (Object.keys(errors).length > 0 || values.category === "" || values.priority === "") {
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        input: { fullName, email, phone, title, description, category: values.category, priority: values.priority }
    };
}

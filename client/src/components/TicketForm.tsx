import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { PublicTicket, TicketFormErrors, TicketFormValues } from "../types/ticket";
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from "../types/ticket";
import { createTicket } from "../services/ticketsApi";
import { validateTicket } from "../utils/validateTicket";
import { getErrorMessage } from "../utils/errors";
import SelectField from "./SelectField";
import ErrorMessage from "./ErrorMessage";

interface TicketFormProps {
    onTicketCreated: (ticket: PublicTicket) => void;
}

type TextField = "fullName" | "email" | "phone" | "title" | "description";

const emptyForm: TicketFormValues = {
    fullName: "",
    email: "",
    phone: "",
    title: "",
    description: "",
    category: "",
    priority: ""
};

const inputClass = "w-full rounded-lg border bg-white px-3 py-2 text-slate-900 outline-none focus:border-violet-500";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

function isTextField(name: string): name is TextField {
    return ["fullName", "email", "phone", "title", "description"].includes(name);
}

export default function TicketForm({ onTicketCreated }: TicketFormProps) {
    const [values, setValues] = useState<TicketFormValues>(emptyForm);
    const [errors, setErrors] = useState<TicketFormErrors>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const updateField = <K extends keyof TicketFormValues>(field: K, value: TicketFormValues[K]) => {
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        if (isTextField(name)) {
            updateField(name, value);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setServerError(null);

        const check = validateTicket(values);
        if (!check.isValid) {
            setErrors(check.errors);
            return;
        }

        setIsSaving(true);
        try {
            const ticket = await createTicket(check.input);
            onTicketCreated(ticket);
        } catch (error) {
            setServerError(getErrorMessage(error, "Failed to send the ticket"));
        } finally {
            setIsSaving(false);
        }
    };

    const fieldClass = (field: keyof TicketFormValues) =>
        `${inputClass} ${errors[field] ? "border-red-400" : "border-slate-300"}`;

    const fieldError = (field: keyof TicketFormValues) =>
        errors[field] !== undefined && <span className="text-xs font-normal text-red-600">{errors[field]}</span>;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                    Full name
                    <input name="fullName" value={values.fullName} onChange={handleChange} className={fieldClass("fullName")} autoComplete="name" />
                    {fieldError("fullName")}
                </label>

                <label className={labelClass}>
                    Email
                    <input name="email" type="email" value={values.email} onChange={handleChange} className={fieldClass("email")} autoComplete="email" />
                    {fieldError("email")}
                </label>

                <label className={labelClass}>
                    Phone
                    <input name="phone" type="tel" value={values.phone} onChange={handleChange} className={fieldClass("phone")} autoComplete="tel" placeholder="050-1234567" />
                    {fieldError("phone")}
                </label>

                <label className={labelClass}>
                    Title
                    <input name="title" value={values.title} onChange={handleChange} className={fieldClass("title")} placeholder="Short summary of the problem" />
                    {fieldError("title")}
                </label>

                <SelectField
                    label="Category"
                    value={values.category}
                    options={TICKET_CATEGORIES}
                    onChange={(category) => updateField("category", category)}
                    error={errors.category}
                />

                <SelectField
                    label="Priority"
                    value={values.priority}
                    options={TICKET_PRIORITIES}
                    onChange={(priority) => updateField("priority", priority)}
                    error={errors.priority}
                />
            </div>

            <label className={labelClass}>
                Description
                <textarea name="description" rows={5} value={values.description} onChange={handleChange} className={fieldClass("description")} placeholder="What happened? What did you already try?" />
                {fieldError("description")}
            </label>

            {serverError !== null && <ErrorMessage message={serverError} />}

            <button
                type="submit"
                disabled={isSaving}
                className="self-start rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
            >
                {isSaving ? "Sending..." : "Send ticket"}
            </button>
        </form>
    );
}

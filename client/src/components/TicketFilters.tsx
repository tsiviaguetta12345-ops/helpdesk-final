import type { TicketFilterValues } from "../types/ticket";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from "../types/ticket";
import SelectField from "./SelectField";

interface TicketFiltersProps {
    filters: TicketFilterValues;
    onChange: (filters: TicketFilterValues) => void;
}

const ALL = "All" as const;

export default function TicketFilters({ filters, onChange }: TicketFiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Search
                <input
                    type="search"
                    value={filters.search}
                    onChange={(event) => onChange({ ...filters, search: event.target.value })}
                    placeholder="Title, name, email, phone, number..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-violet-500"
                />
            </label>
            <SelectField
                label="Status"
                value={filters.status}
                options={[ALL, ...TICKET_STATUSES]}
                onChange={(status) => onChange({ ...filters, status })}
            />
            <SelectField
                label="Priority"
                value={filters.priority}
                options={[ALL, ...TICKET_PRIORITIES]}
                onChange={(priority) => onChange({ ...filters, priority })}
            />
            <SelectField
                label="Category"
                value={filters.category}
                options={[ALL, ...TICKET_CATEGORIES]}
                onChange={(category) => onChange({ ...filters, category })}
            />
        </div>
    );
}

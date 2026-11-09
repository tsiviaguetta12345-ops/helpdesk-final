import { useState } from "react";
import type { TicketFilterValues } from "../types/ticket";
import { useTickets } from "../hooks/useTickets";
import { useAuth } from "../hooks/useAuth";
import { exportTicketsCsv } from "../services/ticketsApi";
import { filterTickets, noFilters } from "../utils/ticketFilters";
import { saveBlob } from "../utils/download";
import { getErrorMessage, isUnauthorized } from "../utils/errors";
import TicketFilters from "../components/TicketFilters";
import TicketsTable from "../components/TicketsTable";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function TicketsPage() {
    const { logout } = useAuth();
    const { tickets, isLoading, error, replaceTicket, removeTicket } = useTickets();
    const [filters, setFilters] = useState<TicketFilterValues>(noFilters);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const visibleTickets = filterTickets(tickets, filters);
    const isFiltered = JSON.stringify(filters) !== JSON.stringify(noFilters);

    const handleExport = async () => {
        setIsExporting(true);
        setExportError(null);
        try {
            saveBlob(await exportTicketsCsv(), "tickets.csv");
        } catch (failure) {
            if (isUnauthorized(failure)) {
                logout();
            } else {
                setExportError(getErrorMessage(failure, "Export failed"));
            }
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-bold text-slate-900">Tickets</h1>
                <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:bg-slate-300"
                >
                    {isExporting ? "Exporting..." : "Export CSV"}
                </button>
            </div>

            {exportError !== null && <ErrorMessage message={exportError} />}

            <TicketFilters filters={filters} onChange={setFilters} />

            {isLoading && <Loading text="Loading tickets..." />}
            {error !== null && <ErrorMessage message={error} />}

            {!isLoading && error === null && (
                <>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{visibleTickets.length} of {tickets.length} tickets</span>
                        {isFiltered && (
                            <button type="button" onClick={() => setFilters(noFilters)} className="font-medium text-violet-600 hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                    <TicketsTable tickets={visibleTickets} onTicketUpdated={replaceTicket} onTicketDeleted={removeTicket} />
                </>
            )}
        </div>
    );
}

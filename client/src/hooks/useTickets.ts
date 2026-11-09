import { useCallback, useEffect, useState } from "react";
import type { PublicTicket } from "../types/ticket";
import { getTickets } from "../services/ticketsApi";
import { useAuth } from "./useAuth";
import { getErrorMessage, isUnauthorized } from "../utils/errors";

// Loads all the tickets once, and gives functions to keep the list up to date.
export function useTickets() {
    const { logout } = useAuth();
    const [tickets, setTickets] = useState<PublicTicket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        getTickets()
            .then((data) => {
                if (isActive) setTickets(data);
            })
            .catch((loadError: unknown) => {
                if (isUnauthorized(loadError)) {
                    logout();
                } else if (isActive) {
                    setError(getErrorMessage(loadError, "Failed to load the tickets"));
                }
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [logout]);

    const replaceTicket = useCallback((updated: PublicTicket) => {
        setTickets((previous) => previous.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
    }, []);

    const removeTicket = useCallback((id: string) => {
        setTickets((previous) => previous.filter((ticket) => ticket.id !== id));
    }, []);

    return { tickets, isLoading, error, replaceTicket, removeTicket };
}

import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AdminSession } from "../types/auth";
import { getStoredToken, storeToken } from "../services/api";
import { AuthContext } from "./authContext";

const USERNAME_KEY = "helpdesk_username";

function readSession(): AdminSession | null {
    const token = getStoredToken();
    const username = sessionStorage.getItem(USERNAME_KEY);
    return token !== null && username !== null ? { token, username } : null;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<AdminSession | null>(readSession);

    const saveSession = useCallback((newSession: AdminSession) => {
        storeToken(newSession.token);
        sessionStorage.setItem(USERNAME_KEY, newSession.username);
        setSession(newSession);
    }, []);

    const logout = useCallback(() => {
        storeToken(null);
        sessionStorage.removeItem(USERNAME_KEY);
        setSession(null);
    }, []);

    const value = useMemo(() => ({ session, saveSession, logout }), [session, saveSession, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

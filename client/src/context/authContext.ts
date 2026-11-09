import { createContext } from "react";
import type { AdminSession } from "../types/auth";

export interface AuthContextValue {
    session: AdminSession | null;
    saveSession: (session: AdminSession) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

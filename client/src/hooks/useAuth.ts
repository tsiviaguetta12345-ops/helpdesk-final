import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import type { AuthContextValue } from "../context/authContext";

export function useAuth(): AuthContextValue {
    const value = useContext(AuthContext);
    if (value === null) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return value;
}

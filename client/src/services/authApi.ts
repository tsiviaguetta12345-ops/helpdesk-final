import type { AdminSession, LoginInput } from "../types/auth";
import { sendRequest } from "./api";

export function login(input: LoginInput): Promise<AdminSession> {
    return sendRequest<AdminSession>("/auth/login", "POST", input);
}

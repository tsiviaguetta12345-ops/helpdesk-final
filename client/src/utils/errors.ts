import { ApiError } from "../services/api";

export function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message !== "" ? error.message : fallback;
}

export function isUnauthorized(error: unknown): boolean {
    return error instanceof ApiError && error.status === 401;
}

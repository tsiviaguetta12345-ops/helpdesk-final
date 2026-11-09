import type { ApiResponse } from "../types/api";

const API_URL: string = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "helpdesk_token";

// Error thrown by the service layer; keeps the HTTP status (401 = must log in again).
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export function getStoredToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string | null): void {
    if (token === null) {
        sessionStorage.removeItem(TOKEN_KEY);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}

function buildHeaders(hasBody: boolean): Headers {
    const headers = new Headers();
    if (hasBody) {
        headers.set("Content-Type", "application/json");
    }
    const token = getStoredToken();
    if (token !== null) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
}

async function callServer(path: string, method: string, body?: unknown): Promise<Response> {
    try {
        return await fetch(`${API_URL}${path}`, {
            method,
            headers: buildHeaders(body !== undefined),
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new ApiError("Cannot reach the server", 0);
    }
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
    return typeof value === "object" && value !== null && "success" in value;
}

// The generic request function of the project: every JSON call goes through here.
export async function sendRequest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await callServer(path, method, body);

    let json: unknown = null;
    try {
        json = await response.json();
    } catch {
        // Not JSON: handled just below.
    }

    if (!isApiResponse(json)) {
        throw new ApiError("Unexpected answer from the server", response.status);
    }

    if (!json.success) {
        throw new ApiError(json.error, response.status);
    }

    return json.data as T;
}

// For the CSV export: the answer is a file, not JSON.
export async function downloadFile(path: string): Promise<Blob> {
    const response = await callServer(path, "GET");

    if (!response.ok) {
        let message = "Download failed";
        try {
            const json: unknown = await response.json();
            if (isApiResponse(json) && !json.success) {
                message = json.error;
            }
        } catch {
            // Keep the default message.
        }
        throw new ApiError(message, response.status);
    }

    return response.blob();
}

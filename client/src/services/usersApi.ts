import type { ApiResponse } from "../types/api";
import type { CreateUserInput, PublicUser } from "../types/user";

const API_URL: string = import.meta.env.VITE_API_URL;

async function sendRequest<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, options);
    const body: ApiResponse<T> = await response.json();

    if (!body.success) {
        throw new Error(body.error);
    }

    return body.data;
}

export async function getUsers(): Promise<PublicUser[]> {
    return sendRequest<PublicUser[]>("/users");
}

export async function getUserById(id: string): Promise<PublicUser> {
    return sendRequest<PublicUser>(`/users/${id}`);
}

export async function createUser(user: CreateUserInput): Promise<PublicUser> {
    return sendRequest<PublicUser>("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
}

export async function deleteUser(id: string): Promise<void> {
    await sendRequest<{ id: string }>(`/users/${id}`, { method: "DELETE" });
}

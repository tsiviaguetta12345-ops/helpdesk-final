import { ObjectId } from "mongodb";

export interface AdminDocument {
    _id?: ObjectId;
    username: string;
    passwordHash: string;
}

export interface LoginInput {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    username: string;
}

// Data stored inside the JWT.
export interface AdminTokenPayload {
    adminId: string;
    username: string;
}

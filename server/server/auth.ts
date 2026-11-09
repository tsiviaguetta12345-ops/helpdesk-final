import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminTokenPayload } from "../type/admin";
import { ApiErrorResponse } from "../type/api";
import { adminExists } from "../db/adminActions";
import { config } from "./config";

const TOKEN_LIFETIME = "8h";

export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export function checkPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}

export function createToken(payload: AdminTokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: TOKEN_LIFETIME });
}

function isTokenPayload(value: unknown): value is AdminTokenPayload {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const { adminId, username } = value as Record<string, unknown>;
    return typeof adminId === "string" && typeof username === "string";
}

// Returns the payload of a valid token, or null (wrong signature, expired, bad format).
export function readToken(token: string): AdminTokenPayload | null {
    try {
        const decoded: unknown = jwt.verify(token, config.jwtSecret);
        return isTokenPayload(decoded) ? decoded : null;
    } catch {
        return null;
    }
}

// Express middleware: lets the request continue only with a valid admin token.
export async function requireAdmin(req: Request, res: Response<ApiErrorResponse>, next: NextFunction): Promise<void> {
    const header = req.headers.authorization;

    if (header === undefined || !header.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Login required" });
        return;
    }

    const payload = readToken(header.slice("Bearer ".length));

    if (payload === null) {
        res.status(401).json({ success: false, error: "Session expired, please log in again" });
        return;
    }

    try {
        if (!(await adminExists(payload.adminId))) {
            res.status(401).json({ success: false, error: "Administrator not found" });
            return;
        }
    } catch {
        res.status(500).json({ success: false, error: "Failed to check the session" });
        return;
    }

    next();
}

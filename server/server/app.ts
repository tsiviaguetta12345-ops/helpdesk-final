import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { ApiErrorResponse } from "../type/api";
import { ticketsRouter } from "./routes/tickets";
import { authRouter } from "./routes/auth";

export function createApp(allowedOrigins: string[]) {
    const app = express();

    app.use(cors({ origin: allowedOrigins }));
    app.use(express.json({ limit: "100kb" }));

    app.use("/tickets", ticketsRouter);
    app.use("/auth", authRouter);

    app.use((_req: Request, res: Response<ApiErrorResponse>) => {
        res.status(404).json({ success: false, error: "Route not found" });
    });

    // Invalid JSON in the body, or any other unexpected error.
    app.use((error: unknown, _req: Request, res: Response<ApiErrorResponse>, _next: NextFunction) => {
        if (error instanceof SyntaxError) {
            res.status(400).json({ success: false, error: "Invalid JSON" });
            return;
        }
        console.log(error);
        res.status(500).json({ success: false, error: "Server error" });
    });

    return app;
}

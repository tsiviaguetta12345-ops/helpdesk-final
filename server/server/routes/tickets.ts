import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { ApiResponse } from "../../type/api";
import { PublicTicket, TicketIdParams } from "../../type/ticket";
import { createTicket, deleteTicket, getTicketById, getTickets, updateTicket } from "../../db/ticketActions";
import { parseCreateTicketInput, parseUpdateTicketInput } from "../validation";
import { requireAdmin } from "../auth";
import { ticketsToCsv } from "../csv";

export const ticketsRouter = Router();

// Public: a customer opens a ticket.
ticketsRouter.post("/", async (req: Request, res: Response<ApiResponse<PublicTicket>>) => {
    const parsed = parseCreateTicketInput(req.body);

    if (!parsed.ok) {
        res.status(400).json({ success: false, error: parsed.error });
        return;
    }

    try {
        const ticket = await createTicket(parsed.value);
        res.status(201).json({ success: true, data: ticket });
    } catch {
        res.status(500).json({ success: false, error: "Failed to create the ticket" });
    }
});

// Everything below is for the administrator only.
ticketsRouter.use(requireAdmin);

ticketsRouter.get("/", async (_req: Request, res: Response<ApiResponse<PublicTicket[]>>) => {
    try {
        res.status(200).json({ success: true, data: await getTickets() });
    } catch {
        res.status(500).json({ success: false, error: "Failed to load the tickets" });
    }
});

// Declared before "/:id" so "export" is not read as an id.
ticketsRouter.get("/export", async (_req: Request, res: Response) => {
    try {
        const csv = ticketsToCsv(await getTickets());
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="tickets.csv"');
        res.status(200).send(csv);
    } catch {
        res.status(500).json({ success: false, error: "Failed to export the tickets" });
    }
});

ticketsRouter.get("/:id", async (req: Request<TicketIdParams>, res: Response<ApiResponse<PublicTicket>>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, error: "Invalid ticket id" });
        return;
    }

    try {
        const ticket = await getTicketById(req.params.id);

        if (ticket === null) {
            res.status(404).json({ success: false, error: "Ticket not found" });
            return;
        }

        res.status(200).json({ success: true, data: ticket });
    } catch {
        res.status(500).json({ success: false, error: "Failed to load the ticket" });
    }
});

ticketsRouter.patch("/:id", async (req: Request<TicketIdParams>, res: Response<ApiResponse<PublicTicket>>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, error: "Invalid ticket id" });
        return;
    }

    const parsed = parseUpdateTicketInput(req.body);

    if (!parsed.ok) {
        res.status(400).json({ success: false, error: parsed.error });
        return;
    }

    try {
        const ticket = await updateTicket(req.params.id, parsed.value);

        if (ticket === null) {
            res.status(404).json({ success: false, error: "Ticket not found" });
            return;
        }

        res.status(200).json({ success: true, data: ticket });
    } catch {
        res.status(500).json({ success: false, error: "Failed to update the ticket" });
    }
});

ticketsRouter.delete("/:id", async (req: Request<TicketIdParams>, res: Response<ApiResponse<TicketIdParams>>) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, error: "Invalid ticket id" });
        return;
    }

    try {
        if (!(await deleteTicket(req.params.id))) {
            res.status(404).json({ success: false, error: "Ticket not found" });
            return;
        }

        res.status(200).json({ success: true, data: { id: req.params.id } });
    } catch {
        res.status(500).json({ success: false, error: "Failed to delete the ticket" });
    }
});

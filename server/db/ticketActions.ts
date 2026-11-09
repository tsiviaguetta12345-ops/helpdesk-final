import { ObjectId, WithId } from "mongodb";
import { ticketsCollection } from "./index";
import { CreateTicketInput, PublicTicket, TicketDocument, UpdateTicketInput } from "../type/ticket";

function toPublicTicket(ticket: WithId<TicketDocument>): PublicTicket {
    return {
        id: ticket._id.toString(),
        fullName: ticket.fullName,
        email: ticket.email,
        phone: ticket.phone,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
    };
}

export async function createTicket(input: CreateTicketInput): Promise<PublicTicket> {
    const now = new Date();
    const document: TicketDocument = {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: "Open",
        createdAt: now,
        updatedAt: now
    };

    const result = await ticketsCollection().insertOne(document);

    if (!result.acknowledged) {
        throw new Error("Failed to create ticket");
    }

    return toPublicTicket({ ...document, _id: result.insertedId });
}

export async function getTickets(): Promise<PublicTicket[]> {
    const tickets = await ticketsCollection().find().sort({ createdAt: -1 }).toArray();
    return tickets.map(toPublicTicket);
}

// The route checks the id with ObjectId.isValid before calling these functions.
export async function getTicketById(id: string): Promise<PublicTicket | null> {
    const ticket = await ticketsCollection().findOne({ _id: new ObjectId(id) });
    return ticket === null ? null : toPublicTicket(ticket);
}

export async function updateTicket(id: string, changes: UpdateTicketInput): Promise<PublicTicket | null> {
    const updated = await ticketsCollection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...changes, updatedAt: new Date() } },
        { returnDocument: "after" }
    );

    return updated === null ? null : toPublicTicket(updated);
}

export async function deleteTicket(id: string): Promise<boolean> {
    const result = await ticketsCollection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}

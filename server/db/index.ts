import { Collection, Db, MongoClient } from "mongodb";
import { TicketDocument } from "../type/ticket";
import { AdminDocument } from "../type/admin";

let client: MongoClient | null = null;
let db: Db | null = null;

function getDb(): Db {
    if (db === null) {
        throw new Error("The database is not connected");
    }
    return db;
}

export function ticketsCollection(): Collection<TicketDocument> {
    return getDb().collection<TicketDocument>("tickets");
}

export function adminsCollection(): Collection<AdminDocument> {
    return getDb().collection<AdminDocument>("admins");
}

export async function connectDB(uri: string, dbName: string): Promise<void> {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    await adminsCollection().createIndex({ username: 1 }, { unique: true });
    console.log(`Connected to MongoDB (database "${dbName}")`);
}

export async function closeDB(): Promise<void> {
    if (client !== null) {
        await client.close();
        client = null;
        db = null;
    }
}

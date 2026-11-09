import { Collection, Db, MongoClient } from "mongodb";
import { UserDocument } from "../type/user";

const uri = process.env.MONGODB_URI ?? "mongodb+srv://baraks_db_user:236TocitlNNQxEuT@cluster0.jajq2gv.mongodb.net/";

const client = new MongoClient(uri);
const db: Db = client.db("users_project");

export const usersCollection: Collection<UserDocument> = db.collection<UserDocument>("users");

export async function connectDB(): Promise<void> {
    await client.connect();
    console.log("Connected to MongoDB");
}

export async function closeDB(): Promise<void> {
    await client.close();
}

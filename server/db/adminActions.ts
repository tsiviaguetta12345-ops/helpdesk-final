import { ObjectId, WithId } from "mongodb";
import { adminsCollection } from "./index";
import { AdminDocument } from "../type/admin";

export async function findAdminByUsername(username: string): Promise<WithId<AdminDocument> | null> {
    return adminsCollection().findOne({ username });
}

export async function adminExists(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
        return false;
    }
    const count = await adminsCollection().countDocuments({ _id: new ObjectId(id) }, { limit: 1 });
    return count === 1;
}

// Creates the administrator, or replaces his password if he already exists.
export async function saveAdmin(username: string, passwordHash: string): Promise<void> {
    await adminsCollection().updateOne(
        { username },
        { $set: { username, passwordHash } },
        { upsert: true }
    );
}

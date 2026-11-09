import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "./index";
import { CreateUserInput, PublicUser, UserDocument } from "../type/user";

function toPublicUser(user: WithId<UserDocument>): PublicUser {
    return {
        id: user._id.toString(),
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName
    };
}

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
    const result = await usersCollection.insertOne({
        name: input.name,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        userName: input.userName
    });

    if (!result.acknowledged) {
        throw new Error("Failed to create user");
    }

    return {
        id: result.insertedId.toString(),
        name: input.name,
        lastName: input.lastName,
        email: input.email,
        userName: input.userName
    };
}

export async function getUsers(): Promise<PublicUser[]> {
    const users = await usersCollection.find().toArray();
    return users.map(toPublicUser);
}

export async function getUserById(id: string): Promise<PublicUser | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (user === null) {
        return null;
    }

    return toPublicUser(user);
}

export async function deleteUser(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
        return false;
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}

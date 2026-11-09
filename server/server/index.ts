import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "../db/index";
import { createUser, deleteUser, getUserById, getUsers } from "../db/actions";
import { CreateUserInput, PublicUser } from "../type/user";
import { ApiResponse } from "../type/api";

const app = express();
const PORT = 3000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3005"] }));
app.use(express.json());

interface UserIdParams {
    id: string;
}

function isFilledString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function parseCreateUserInput(body: unknown): CreateUserInput | null {
    if (typeof body !== "object" || body === null) {
        return null;
    }

    const { name, lastName, email, password, userName } = body as Record<string, unknown>;

    if (!isFilledString(name) || !isFilledString(lastName) || !isFilledString(email) || !isFilledString(password) || !isFilledString(userName)) {
        return null;
    }

    return { name, lastName, email, password, userName };
}

app.post("/users", async (req: Request, res: Response<ApiResponse<PublicUser>>) => {
    const input = parseCreateUserInput(req.body);

    if (input === null) {
        res.status(400).json({ success: false, error: "All fields are required" });
        return;
    }

    try {
        const user = await createUser(input);
        res.status(201).json({ success: true, data: user });
    } catch {
        res.status(500).json({ success: false, error: "Failed to create user" });
    }
});

app.get("/users", async (_req: Request, res: Response<ApiResponse<PublicUser[]>>) => {
    try {
        const users = await getUsers();
        res.status(200).json({ success: true, data: users });
    } catch {
        res.status(500).json({ success: false, error: "Failed to load users" });
    }
});

app.get("/users/:id", async (req: Request<UserIdParams>, res: Response<ApiResponse<PublicUser>>) => {
    try {
        const user = await getUserById(req.params.id);

        if (user === null) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch {
        res.status(500).json({ success: false, error: "Failed to load user" });
    }
});

app.delete("/users/:id", async (req: Request<UserIdParams>, res: Response<ApiResponse<UserIdParams>>) => {
    try {
        const isDeleted = await deleteUser(req.params.id);

        if (!isDeleted) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }

        res.status(200).json({ success: true, data: { id: req.params.id } });
    } catch {
        res.status(500).json({ success: false, error: "Failed to delete user" });
    }
});

async function start(): Promise<void> {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start().catch((error: unknown) => {
    console.log("Failed to start the server");
    console.log(error);
});

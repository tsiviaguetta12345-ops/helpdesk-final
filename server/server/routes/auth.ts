import { Request, Response, Router } from "express";
import { ApiResponse } from "../../type/api";
import { LoginResponse } from "../../type/admin";
import { findAdminByUsername } from "../../db/adminActions";
import { parseLoginInput } from "../validation";
import { checkPassword, createToken } from "../auth";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response<ApiResponse<LoginResponse>>) => {
    const parsed = parseLoginInput(req.body);

    if (!parsed.ok) {
        res.status(400).json({ success: false, error: parsed.error });
        return;
    }

    try {
        const admin = await findAdminByUsername(parsed.value.username);

        // Same answer for an unknown username and a wrong password.
        if (admin === null || !(await checkPassword(parsed.value.password, admin.passwordHash))) {
            res.status(401).json({ success: false, error: "Wrong username or password" });
            return;
        }

        const token = createToken({ adminId: admin._id.toString(), username: admin.username });
        res.status(200).json({ success: true, data: { token, username: admin.username } });
    } catch {
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

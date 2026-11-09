// Creates the administrator (or changes his password): npm run create-admin
import { closeDB, connectDB } from "../db/index";
import { saveAdmin } from "../db/adminActions";
import { hashPassword } from "../server/auth";
import { config } from "../server/config";

async function main(): Promise<void> {
    const username = process.env.ADMIN_USERNAME?.trim() ?? "";
    const password = process.env.ADMIN_PASSWORD ?? "";

    if (username === "" || password.length < 8) {
        throw new Error("Set ADMIN_USERNAME and ADMIN_PASSWORD (at least 8 characters) in server/.env");
    }

    await connectDB(config.mongoUri, config.dbName);
    await saveAdmin(username, await hashPassword(password));
    console.log(`Administrator "${username}" is ready`);
    await closeDB();
}

main().catch(async (error: unknown) => {
    console.log(error instanceof Error ? error.message : error);
    await closeDB();
    process.exit(1);
});

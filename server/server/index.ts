import { connectDB } from "../db/index";
import { createApp } from "./app";
import { config } from "./config";

async function start(): Promise<void> {
    if (config.jwtSecret.length < 16) {
        throw new Error("JWT_SECRET is missing in server/.env (use at least 16 characters)");
    }

    await connectDB(config.mongoUri, config.dbName);

    createApp(config.clientOrigins).listen(config.port, () => {
        console.log(`Server is running on http://localhost:${config.port}`);
    });
}

start().catch((error: unknown) => {
    console.log("Failed to start the server");
    console.log(error);
    process.exit(1);
});

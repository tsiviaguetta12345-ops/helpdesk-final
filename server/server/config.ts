// Reads the settings from the environment (server/.env, loaded with node --env-file).
function readNumber(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const config = {
    mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
    dbName: process.env.DB_NAME ?? "helpdesk",
    port: readNumber(process.env.PORT, 3000),
    clientOrigins: (process.env.CLIENT_ORIGIN ?? "http://localhost:3005,http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim()),
    jwtSecret: process.env.JWT_SECRET ?? ""
};

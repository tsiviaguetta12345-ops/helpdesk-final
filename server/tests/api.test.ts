// API tests: npm test (uses a temporary in-memory MongoDB, nothing to install).
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { Server } from "node:http";
import { AddressInfo } from "node:net";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = "test-secret-for-the-api-tests";

import { closeDB, connectDB } from "../db/index";
import { saveAdmin } from "../db/adminActions";
import { hashPassword } from "../server/auth";
import { createApp } from "../server/app";

let mongo: MongoMemoryServer;
let server: Server;
let baseUrl = "";
let token = "";

const validTicket = {
    fullName: "Dana Levi",
    email: "dana@example.com",
    phone: "050-1234567",
    title: "Printer does not work",
    description: "The printer on the second floor shows a paper jam error.",
    category: "Hardware",
    priority: "High"
};

async function call(method: string, path: string, body?: unknown, withToken = true) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (withToken && token !== "") {
        headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    const isJson = (response.headers.get("content-type") ?? "").includes("application/json");
    return { status: response.status, body: isJson ? await response.json() : await response.text() };
}

before(async () => {
    mongo = await MongoMemoryServer.create();
    await connectDB(mongo.getUri(), "helpdesk_test");
    await saveAdmin("admin", await hashPassword("secret-password"));
    server = createApp(["http://localhost:3005"]).listen(0);
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(async () => {
    server.close();
    await closeDB();
    await mongo.stop();
});

describe("Help Desk API", () => {
    let ticketId = "";

    test("rejects an invalid ticket", async () => {
        const result = await call("POST", "/tickets", { ...validTicket, email: "not-an-email" }, false);
        assert.equal(result.status, 400);
        assert.equal(result.body.success, false);
    });

    test("creates a ticket with status Open", async () => {
        const result = await call("POST", "/tickets", { ...validTicket, status: "Closed" }, false);
        assert.equal(result.status, 201);
        assert.equal(result.body.data.status, "Open");
        assert.equal(result.body.data.createdAt, result.body.data.updatedAt);
        ticketId = result.body.data.id;
    });

    test("protects the admin endpoints", async () => {
        assert.equal((await call("GET", "/tickets", undefined, false)).status, 401);
        token = "not-a-real-token";
        assert.equal((await call("GET", "/tickets")).status, 401);
    });

    test("refuses a wrong password", async () => {
        const result = await call("POST", "/auth/login", { username: "admin", password: "wrong" }, false);
        assert.equal(result.status, 401);
    });

    test("logs in the administrator", async () => {
        const result = await call("POST", "/auth/login", { username: "admin", password: "secret-password" }, false);
        assert.equal(result.status, 200);
        token = result.body.data.token;
    });

    test("lists and reads tickets", async () => {
        const list = await call("GET", "/tickets");
        assert.equal(list.status, 200);
        assert.equal(list.body.data.length, 1);

        assert.equal((await call("GET", `/tickets/${ticketId}`)).body.data.title, validTicket.title);
        assert.equal((await call("GET", "/tickets/123")).status, 400);
        assert.equal((await call("GET", "/tickets/0123456789abcdef01234567")).status, 404);
    });

    test("updates status and priority", async () => {
        assert.equal((await call("PATCH", `/tickets/${ticketId}`, { status: "Done" })).status, 400);
        assert.equal((await call("PATCH", `/tickets/${ticketId}`, { title: "x" })).status, 400);

        const result = await call("PATCH", `/tickets/${ticketId}`, { status: "In Progress", priority: "Low" });
        assert.equal(result.status, 200);
        assert.equal(result.body.data.status, "In Progress");
        assert.equal(result.body.data.priority, "Low");
        assert.ok(result.body.data.updatedAt > result.body.data.createdAt);
    });

    test("exports CSV", async () => {
        const result = await call("GET", "/tickets/export");
        assert.equal(result.status, 200);
        assert.match(result.body, /Ticket ID,Full Name,Email/);
        assert.match(result.body, /Printer does not work/);
    });

    test("deletes a ticket", async () => {
        assert.equal((await call("DELETE", `/tickets/${ticketId}`)).status, 200);
        assert.equal((await call("DELETE", `/tickets/${ticketId}`)).status, 404);
    });
});

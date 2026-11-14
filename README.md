# Help Desk – Full Stack TypeScript

## Project Description
Final project of the TypeScript course: a service-ticket management system (Help Desk).

- A **customer** (no account needed) opens a service ticket from a public page. The form is validated, the ticket is saved in MongoDB with the status `Open`, and the customer is sent to a confirmation page.
- The **administrator** logs in to a protected management area where he can see a dashboard, list all the tickets, search and filter them, open the details of a ticket, change its status and priority, delete it (after confirmation), export all the tickets to a CSV file, and log out.

## Starting Point
The project is built on the last Full Stack project of the course (**users management**). It was not started from zero.

Kept from the base project and adapted to tickets:
- Vite + React + TypeScript, TailwindCSS, Radix UI (`Dialog`, `AlertDialog`).
- The `Loading` and `ErrorMessage` components, typed props and typed state, `useEffect` for loading data.
- The `services` layer with the generic request function based on `fetch`, `ApiResponse<T>` (success / error), `VITE_API_URL`.
- Express + TypeScript, CORS, the `server / db / type` structure.
- MongoDB Native Driver, typed collections, separate database actions, conversion from a MongoDB document to the object returned to the client, `ObjectId` check.
- External input received as `unknown` and checked with type guards / parsing functions.

Mapping of the base components:

| Base project | Final project |
|---|---|
| `UserForm` | `TicketForm` – public form to open a ticket |
| `UserList` | `TicketsTable` – list of tickets |
| `UserCard` | Row of `TicketsTable` |
| `UserDetailsDialog` | `TicketDetailsDialog` – details + update |
| `DeleteUserDialog` | `DeleteTicketDialog` – delete confirmation |
| `Loading`, `ErrorMessage` | Reused |

What is new: several pages with React Router, administrator login (bcrypt + JWT) protecting the management area, dashboard, search and filters, update (PATCH), CSV export.

## Technologies
**Client:** Vite, React, TypeScript, TailwindCSS, Radix UI (`Dialog`, `AlertDialog`, `Select`), React Router, `fetch` through the services layer.

**Server:** Node.js, Express, TypeScript, MongoDB, MongoDB Native Driver, CORS, `bcryptjs` (password hashing), `jsonwebtoken` (JWT).

**Tests:** `node:test` + `mongodb-memory-server`.

## Pages
| Route | Page | Role | Access |
|---|---|---|---|
| `/` | Open a ticket | Public form with client validation | Public |
| `/ticket-created` | Confirmation | Shown only after the server saved the ticket, displays its number | Public |
| `/admin/login` | Admin login | Username + password | Public |
| `/admin` | Dashboard | Total Tickets, Open, In Progress, Resolved, High Priority + latest tickets | Admin |
| `/admin/tickets` | Tickets management | List, search, filters, details, update, delete, CSV export | Admin |
| `*` | Not found | Page for unknown addresses | Public |

A visitor who is not logged in and opens `/admin` or `/admin/tickets` is redirected to `/admin/login`.

### Main components
- `PublicLayout`, `AdminLayout` (navigation + Logout), `RequireAdmin` (redirects to the login page when there is no session).
- `TicketForm` (controlled form + client validation), `SelectField` (typed Radix `Select`).
- `TicketsTable`, `TicketFilters` (search + status / priority / category filters).
- `TicketDetailsDialog` (Radix `Dialog`: loads one ticket by id from the server, changes status and priority).
- `DeleteTicketDialog` (Radix `AlertDialog`: Cancel / Delete, loading and error states).
- `StatCard`, `StatusBadge`, `PriorityBadge`, `Loading`, `ErrorMessage`.

## Project Structure
```
helpdesk-final/
├── README.md
├── client/                     # React (Vite)
│   ├── .env.example
│   └── src/
│       ├── App.tsx             # React Router: all the routes
│       ├── main.tsx
│       ├── pages/              # NewTicketPage, TicketCreatedPage, LoginPage, DashboardPage, TicketsPage, NotFoundPage
│       ├── components/         # TicketForm, TicketsTable, TicketFilters, dialogs, layouts, Loading, ErrorMessage...
│       ├── services/           # api.ts (generic fetch function), ticketsApi.ts, authApi.ts
│       ├── types/              # ticket.ts, api.ts, auth.ts
│       ├── context/ + hooks/   # admin session (AuthProvider, useAuth), useTickets
│       └── utils/              # validation, filters, dates, download
└── server/                     # Express + TypeScript
    ├── .env.example
    ├── server/                 # app.ts, index.ts, routes/, validation.ts, auth.ts, csv.ts, config.ts
    ├── db/                     # index.ts (connection + typed collections), ticketActions.ts, adminActions.ts
    ├── type/                   # ticket.ts, admin.ts, api.ts
    ├── scripts/createAdmin.ts  # creates the administrator
    └── tests/api.test.ts
```

### Who does what
- **React (pages + components)**: displays data, keeps typed state, validates the form before sending, filters and searches the loaded list, computes the dashboard counters.
- **API service layer (`client/src/services`)**: the only place that calls `fetch`; builds the URL from `VITE_API_URL`, adds the token, reads `ApiResponse<T>` and throws an error with the server message on failure.
- **Express (`server/server`)**: routes, parsing of the `unknown` body, server validation, authentication middleware, HTTP status codes, CSV generation.
- **Database layer (`server/db`)**: only MongoDB code – typed collections, queries, conversion of documents to `PublicTicket`. It does not know Express.

## Data Model
Database `helpdesk`, two collections.

**`tickets`** – one document per service ticket:

| Field | Type | Notes |
|---|---|---|
| `_id` | `ObjectId` | Unique id (the ticket number) |
| `fullName` | `string` | Customer name |
| `email` | `string` | |
| `phone` | `string` | |
| `title` | `string` | Short description of the problem |
| `description` | `string` | Details |
| `category` | `"Hardware" \| "Software" \| "Network" \| "Account" \| "Other"` | |
| `priority` | `"Low" \| "Medium" \| "High"` | |
| `status` | `"Open" \| "In Progress" \| "Resolved"` | Always `Open` when created; only the admin changes it |
| `createdAt` | `Date` | Set by the server |
| `updatedAt` | `Date` | Set by the server, changed on every update |

**`admins`** – the administrator:

| Field | Type | Notes |
|---|---|---|
| `_id` | `ObjectId` | |
| `username` | `string` | Unique index |
| `passwordHash` | `string` | bcrypt hash – the password is never saved as plain text |

### Main types
- `TicketCategory`, `TicketPriority`, `TicketStatus` – unions built from constant arrays.
- `CreateTicketInput` – what the public form sends.
- `TicketDocument` – what is stored in MongoDB (dates are `Date`).
- `PublicTicket` – what the server returns (`id` as a string, dates as ISO strings).
- `UpdateTicketInput` – `status` and/or `priority` only (the only fields the admin may change).
- `AdminDocument`, `LoginInput`, `LoginResponse`, `AdminTokenPayload`.
- `ApiResponse<T>` – `{ success: true, data }` or `{ success: false, error }`.
- Client only: `TicketFormValues`, `TicketFormErrors`, `TicketFilterValues`, props of each component.

## API
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/tickets` | Public | Open a ticket (the server sets `status = Open`, `createdAt`, `updatedAt`) – `201` |
| POST | `/admin/login` | Public | Check username + password, return a JWT – `200` / `401` |
| GET | `/tickets` | Admin | All tickets, newest first |
| GET | `/tickets/:id` | Admin | One ticket – `400` invalid id, `404` not found |
| PATCH | `/tickets/:id` | Admin | Change `status` and/or `priority` (refreshes `updatedAt`) |
| DELETE | `/tickets/:id` | Admin | Delete a ticket – `404` if it does not exist |
| GET | `/tickets/export/csv` | Admin | Download all tickets as a CSV file |

Every JSON answer has the form `ApiResponse<T>`. Status codes used: `200`, `201`, `400` (invalid body / id / JSON), `401` (no token, invalid token, wrong login), `404`, `500`.

## Authentication
- The administrator already exists in the database (`npm run create-admin`); there is no registration.
- His password is hashed with **bcrypt**, only the hash is saved in the `admins` collection.
- `POST /admin/login` compares the password with the hash. A wrong username and a wrong password give the same message: `Invalid username or password`.
- On success the server returns a **JWT** (valid 8 hours) signed with `JWT_SECRET`. The client keeps it in `sessionStorage` and sends it in the header `Authorization: Bearer <token>`.
- The `requireAdmin` Express middleware protects every admin endpoint: without a valid token the server answers `401`. Hiding a link in React is not a protection.
- On the client, `RequireAdmin` (React Router) sends a visitor without a session to `/admin/login`.
- **Logout** removes the token from the client; the next admin requests are refused until a new login.

## Environment Variables
`server/.env` (copy from `server/.env.example`):

| Variable | Meaning |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name (default `helpdesk`) |
| `PORT` | Server port (default `3000`) |
| `CLIENT_ORIGIN` | Allowed client address for CORS (default `http://localhost:3005`) |
| `JWT_SECRET` | Long random secret used to sign the tokens (at least 16 characters) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Used only by `npm run create-admin` |

`client/.env` (copy from `client/.env.example`):

| Variable | Meaning |
|---|---|
| `VITE_API_URL` | Address of the server, e.g. `http://localhost:3000` |

The `.env` files are in `.gitignore` and are never pushed to GitHub.

## Installation
Requirements: Node.js 20+ and a MongoDB server (local, or a MongoDB Atlas connection string).

```bash
# Server
cd server
npm install
cp .env.example .env        # then edit the values
npm run create-admin        # creates the administrator from ADMIN_USERNAME / ADMIN_PASSWORD

# Client
cd ../client
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:3000
```

## Run
```bash
# Terminal 1 – server (http://localhost:3000)
cd server
npm run dev

# Terminal 2 – client (http://localhost:3005)
cd client
npm run dev
```

- Public form: http://localhost:3005
- Admin area: http://localhost:3005/admin/login

### Tests
`cd server && npm test` runs the API tests against a temporary in-memory MongoDB (nothing to install).

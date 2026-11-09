# Help Desk – Full Stack TypeScript

Final project of the TypeScript course: a service-ticket management system.
Customers open a ticket from a public page; the administrator logs in to a management area to follow, update, delete and export the tickets.

---

## 1. Planning (written before the development)

### Starting point
The project is built on the last course project (users management).
Kept from it: Vite + React + TypeScript, TailwindCSS, Radix UI (`Dialog`, `AlertDialog`), the `Loading` and `ErrorMessage` components, typed props and state, `useEffect` for loading data, the `services` layer with the generic `fetch` request function, `ApiResponse<T>`, `VITE_API_URL`, Express + TypeScript, CORS, the `server / db / type` structure, the MongoDB Native Driver with typed collections, separate database actions, the conversion from a MongoDB document to the object returned to the client, the `ObjectId` check, external input received as `unknown` and checked with type guards.

What changes: users become tickets, the single `App.tsx` screen becomes several pages with React Router, and an administrator login protects the management area.

### Pages
| Route | Page | Role | Access |
|---|---|---|---|
| `/` | Open a ticket | Public form with validation | Public |
| `/ticket-created` | Confirmation | Shown after the server saved the ticket, displays its number | Public |
| `/admin/login` | Admin login | Username + password | Public |
| `/admin` | Dashboard | Counters: total, by status, high priority, latest tickets | Admin |
| `/admin/tickets` | Tickets management | List, search, filters, details, update, delete, CSV export | Admin |
| `*` | Not found | Page for unknown addresses | Public |

### Main components
- `PublicLayout`, `AdminLayout` (navigation bar + Logout), `RequireAdmin` (redirects to the login page when there is no session).
- `TicketForm` (controlled form + client validation), `SelectField` (Radix `Select`).
- `TicketsTable`, `TicketFilters` (search text + status / priority / category filters).
- `TicketDetailsDialog` (Radix `Dialog`: loads one ticket by id, changes status and priority).
- `DeleteTicketDialog` (Radix `AlertDialog`).
- `StatCard`, `StatusBadge`, `PriorityBadge`, `Loading`, `ErrorMessage`.

### Main types
- Unions built from constant arrays: `TicketCategory` (`Hardware`, `Software`, `Network`, `Account`, `Other`), `TicketPriority` (`Low`, `Medium`, `High`), `TicketStatus` (`Open`, `In Progress`, `Closed`).
- `CreateTicketInput` – what the public form sends.
- `TicketDocument` – what is stored in MongoDB (dates are `Date`).
- `PublicTicket` – what the server returns (`id` as a string, dates as ISO strings).
- `UpdateTicketInput` – `status` and/or `priority` only.
- `AdminDocument` (`username`, `passwordHash`), `LoginInput`, `LoginResponse` (`token`, `username`).
- `ApiResponse<T>` – `{ success: true, data }` or `{ success: false, error }`.
- Client only: `TicketFormErrors`, `TicketFilterValues`, props of each component.

### MongoDB
Database `helpdesk` with two collections:
- `tickets`: `fullName`, `email`, `phone`, `title`, `description`, `category`, `priority`, `status`, `createdAt`, `updatedAt`. The `_id` is the ticket number.
- `admins`: `username` (unique index), `passwordHash` (bcrypt – the password is never saved as plain text). The administrator is created by a script (`npm run create-admin`), there is no public registration.

### API endpoints
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/tickets` | Public | Open a ticket (the server sets `status = Open`, `createdAt`, `updatedAt`) |
| POST | `/auth/login` | Public | Check username + password, return a JWT |
| GET | `/tickets` | Admin | All tickets, newest first |
| GET | `/tickets/export` | Admin | Download all tickets as a CSV file |
| GET | `/tickets/:id` | Admin | One ticket |
| PATCH | `/tickets/:id` | Admin | Change `status` and/or `priority` (refreshes `updatedAt`) |
| DELETE | `/tickets/:id` | Admin | Delete a ticket |

Protected endpoints need the header `Authorization: Bearer <token>`. The check is done by an Express middleware on the server – hiding a link in React is not a protection.

### Who does what
- **React (pages + components)**: displays data, keeps typed state, validates the form before sending, filters and searches the loaded list, computes the dashboard counters.
- **API service layer (`client/src/services`)**: the only place that calls `fetch`; builds the URL from `VITE_API_URL`, adds the token, reads `ApiResponse<T>` and throws an `Error` with the server message on failure.
- **Express (`server/server`)**: routes, parsing of the `unknown` body, server validation, authentication middleware, HTTP status codes, CSV generation.
- **Database layer (`server/db`)**: only MongoDB code – typed collections, queries, conversion of documents to `PublicTicket`. It does not know Express.

---

## 2. Installation and run

### Requirements
- Node.js 20+
- A MongoDB server (local, or a MongoDB Atlas connection string)

### Server
```bash
cd server
npm install
cp .env.example .env        # then edit the values
npm run create-admin        # creates the administrator from ADMIN_USERNAME / ADMIN_PASSWORD
npm run dev                 # http://localhost:3000
```

`server/.env`:
| Variable | Meaning |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name (default `helpdesk`) |
| `PORT` | Server port (default `3000`) |
| `CLIENT_ORIGIN` | Allowed client address for CORS (default `http://localhost:3005`) |
| `JWT_SECRET` | Long random secret used to sign the tokens |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Used only by `npm run create-admin` |

### Client
```bash
cd client
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:3000
npm run dev                 # http://localhost:3005
```

- Public form: http://localhost:3005
- Admin area: http://localhost:3005/admin/login

### Tests
`cd server && npm test` runs the API tests against a temporary in-memory MongoDB (nothing to install).

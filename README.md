# Task Manager Portal — Full Stack Assessment

A production-style project & task management portal built with React (frontend),
Node.js/Express (backend, layered architecture), and SQLite (relational database
via better-sqlite3). Includes migrations, validation, security middleware,
Docker packaging, automated tests, and PWA support.

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 18, custom hooks, plain CSS (mobile-first, responsive) |
| Backend | Node.js 18+, Express, layered (routes → controllers → db) |
| Database | SQLite (better-sqlite3), file-based with versioned SQL migrations |
| Security | Helmet, CORS allow-list, rate limiting, input validation |
| Testing | Jest + Supertest (backend API tests) |
| Packaging | Docker + docker-compose, multi-stage builds |
| Bonus | PWA support (manifest + service worker, installable, offline shell) |

## Architecture

```text
Client (React) → REST API (Express) → Controller → better-sqlite3 → SQLite file
```

Backend follows a layered structure for maintainability:

- `routes/` — URL → handler mapping only
- `controllers/` — business logic
- `middleware/` — validation, error handling, rate limiting, security
- `db/migrations/` — versioned, idempotent SQL migrations (tracked in a `_migrations` table)

## Data Model

### tasks

| Column | Type | Constraints |
|----------|---------|-------------|
| id | INTEGER | PK, autoincrement |
| title | TEXT | required, max 150 chars |
| description | TEXT | optional, max 2000 chars |
| priority | TEXT | CHECK IN ('Low','Medium','High') |
| status | TEXT | CHECK IN ('Pending','In Progress','Completed') |
| created_date | TEXT (ISO 8601) | set on insert |
| updated_date | TEXT (ISO 8601) | set on every update |

See `backend/src/db/migrations/001_create_tasks_table.sql`.

## API Reference

Base URL:

```text
http://localhost:5000/api
```

| Method | Endpoint | Description | Body |
|----------|------------|-------------|------|
| GET | /health | Health check | — |
| GET | /tasks | List tasks. Query: `?status=&priority=&search=` | — |
| GET | /tasks/:id | Get one task | — |
| POST | /tasks | Create task | `{ title, description?, priority?, status? }` |
| PUT | /tasks/:id | Update task (partial allowed) | any subset of the above |
| DELETE | /tasks/:id | Delete task | — |

All error responses:

```json
{ "error": "message" }
```

with an appropriate HTTP status code:

- `400` Validation Error
- `404` Not Found
- `429` Too Many Requests
- `500` Internal Server Error

---

## Local Setup — Without Docker

### Prerequisites

- Node.js 18 LTS or newer
- npm 9+

### 1. Clone and Configure

```bash
git clone <your-repo-url> task-manager
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run migrate     
npm test          
npm run dev        
```

> A `backend/.env` file is required before running the commands above.

### 3. Frontend Setup (Open a New Terminal)

```bash
cd frontend
npm install
npm start           
```

The database file is created automatically at:

```text
backend/data/tasks.db
```

on the first migration run — no manual SQL setup required.

---

## Setup With Docker (Recommended for Evaluation)

### Prerequisites

- Docker
- Docker Compose

Start the application:

```bash
docker-compose up --build
```

### Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

Data persists in the named Docker volume:

```text
db-data
```

### Stop Containers

```bash
docker-compose down
```

### Stop and Remove Database Volume

```bash
docker-compose down -v
```

---

## Environment Variables

### backend/.env

| Variable | Description | Default |
|------------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | API port | 5000 |
| DB_PATH | SQLite file path | ./data/tasks.db |
| CORS_ORIGIN | Allowed frontend origin | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate-limit window | 900000 (15 min) |
| RATE_LIMIT_MAX | Max requests per window per IP | 200 |

### frontend/.env

| Variable | Description | Default |
|------------|-------------|---------|
| REACT_APP_API_URL | Backend API base URL | http://localhost:5000/api |

---

## UX Features Implemented

- Client-side + server-side form validation with inline field errors
- Loading spinner while fetching
- Success/error toast notifications for every mutation
- Delete confirmation modal (no accidental deletes)
- Empty state when no tasks exist
- Debounced live search + status filter
- Optimistic status update with automatic rollback on API failure
- Fully responsive grid layout (mobile, tablet, desktop breakpoints)
- Installable PWA: add-to-home-screen, offline app shell via service worker

---

## Error Handling Strategy

- Centralized Express error-handling middleware — no unhandled promise rejections
- `asyncHandler` wrapper on all async controllers
- Consistent JSON error shape across all endpoints
- 404 handler for unmatched routes
- Helmet for HTTP security headers
- Rate limiting to mitigate abuse
- Frontend never trusts client-only validation
- Server response errors are surfaced to users via toast notifications even when client validation succeeds

---

## Testing

Run backend tests:

```bash
cd backend
npm test
```

### Test Coverage

- Validation failure
- Task creation
- Task listing
- Status update
- Task deletion
- 404-after-delete scenario

Tests use an isolated test database that is automatically cleaned up after execution.

---

## Design Decisions & Trade-offs

### SQLite over Postgres/MySQL

Chosen for:

- Zero-configuration setup
- Easier evaluation and review
- No external database service required

The data layer is isolated inside `db/` and `controllers/`, making migration to PostgreSQL straightforward by replacing the driver and connection configuration.

### No ORM

Using `better-sqlite3` with parameterized SQL queries:

- Keeps the data layer transparent
- Reduces abstraction overhead
- Improves performance for a small schema
- Prevents SQL injection

### PWA over Payment Gateway Bonus

PWA support was selected because it directly enhances user experience:

- Installable application
- Offline shell support
- Better mobile usability

A payment gateway would require external credentials and configuration outside the scope of the assignment.

### No Authentication Layer

Authentication was intentionally omitted because it was not required by the assessment brief.

For a production environment, the recommended next step would be:

- JWT-based authentication
- User registration and login
- Per-user task ownership and authorization

---

## Git Workflow

```bash
git init
git add .
git commit -m "chore: initial commit — full stack task manager"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

---


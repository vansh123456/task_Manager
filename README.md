# Cleanomatics — Full-Stack Task Management System

A production-grade, full-stack Task Management System engineered with a **React (Vite)** frontend and an **Express (Node.js)** backend featuring pure in-memory data persistence, clean layered architecture, robust validation, and a modern dark-mode user experience.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Core Features](#core-features)
  - [Bonus Features](#bonus-features)
- [Architecture & Design Decisions](#architecture--design-decisions)
  - [Backend Architecture](#backend-architecture)
  - [Frontend Architecture](#frontend-architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Reference](#api-reference)
  - [REST Endpoints](#rest-endpoints)
  - [Response Envelope Standards](#response-envelope-standards)
- [API Documentation & Tooling](#api-documentation--tooling)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [License](#license)

---

## 🌟 Overview

Cleanomatics is designed following senior-level software engineering practices:
- **Strict Separation of Concerns**: Clean boundaries between HTTP routing, business logic, persistence, and presentation.
- **Pure In-Memory Persistence**: Zero database dependencies. Tasks are managed safely in backend process memory using defensive copying and UUID v4 keys.
- **Zero-Compromise Error Handling**: Centralized Express error handler distinguishing operational errors (4xx) from programming defects (5xx).
- **Modern Dark UI**: Component-scoped CSS Modules styled with CSS custom properties (tokens), responsive layouts, smooth micro-interactions, and accessible forms.

---

## 🚀 Key Features

### Core Features
- **Task Dashboard (`/`)**:
  - Live task cards displaying title, description, color-coded status, priority, due date, and creation date.
  - Interactive statistical counters (Total, Pending, In Progress, Completed) that double as instant filters.
  - Overdue warning indicators on past-due items.
  - Contextual empty states ("No tasks yet" vs. "No tasks match filters").
  - Shimmer-animated loading skeletons while data is in flight.
  - Operational error banners with retry action.
- **Create Task (`/tasks/new`)**:
  - Comprehensive form validating Title (required, max 100 chars), Description (required, max 1000 chars), Status, Priority, and optional Due Date.
  - Live client-side validation on blur and submit with character count indicators.
  - Backend validation error mapping (field errors highlighted directly beneath corresponding inputs).
- **Edit Task (`/tasks/:id/edit`)**:
  - Pre-populated form fetching existing task data.
  - Graceful 404 handling if task is removed.
  - Seamless redirection back to dashboard upon save with animated feedback toast.
- **Task Details View (`/tasks/:id`)**:
  - Dedicated page rendering all task fields including system timestamps (`createdAt`, `updatedAt`).
  - Full-text description view preserving paragraph formatting (`white-space: pre-wrap`).
  - One-click copy button for Task UUID with instant visual feedback.
  - Inline quick status dropdown.
- **Safe Delete Workflow**:
  - Accessible confirmation modal dialog with ESC key dismiss and background blur to prevent accidental deletion.
  - Optimistic dashboard updates and dismissible success toast.

### Bonus Features
- **Client-Side Pagination**:
  - Smooth page navigation (6 tasks per page) with Previous, Next, and individual page buttons.
  - Current item range summary (e.g., `Showing 1–6 of 14 tasks`).
  - Automatic page reset when searching or modifying filter criteria.
- **Multi-Criteria Search & Filtering**:
  - Real-time instant search by task title or description.
  - Status filter dropdown (`pending`, `in_progress`, `completed`).
  - Priority filter dropdown (`low`, `medium`, `high`).
  - Sorting selector (`Newest First`, `Oldest First`, `Due Date Soonest`, `Priority High-to-Low`, `Title A-Z`).
  - One-click "Reset filters" button.
- **Quick Status Advance on Task Cards**:
  - Direct status transition toggle right on dashboard cards:
    - `Pending` ➔ **Start** (moves to `in_progress`)
    - `In Progress` ➔ **Complete** (moves to `completed`)
    - `Completed` ➔ **Reopen** (resets to `pending`)
  - Inline micro-spinner during background network sync.
- **Comprehensive API Documentation**:
  - Exported **Postman Collection v2.1.0** with test scripts and collection variables.
  - Standard **OpenAPI 3.0.3 (Swagger)** YAML specification.

---

## 🏛️ Architecture & Design Decisions

### Backend Architecture
```
Backend/src/
├── app.js               # Express application initialization & middleware pipeline
├── server.js            # HTTP server bootstrap & graceful shutdown handling
├── routes/              # Express Router definitions (URL mapping only)
├── controllers/         # Thin HTTP controllers (request extraction, response sending)
├── services/            # Pure business logic (task validation, defaults, timestamps)
├── services/taskStore.js# In-memory storage layer (defensive copies, isolation)
├── middleware/          # Input validation middleware & centralized error handler
└── utils/               # AppError class
```

- **Layered Pattern**: Controllers never manipulate data directly; they invoke `taskService.js`, which manages transactions against `taskStore.js`.
- **Defensive Immutability**: `taskStore` returns clones of objects to ensure outside callers cannot inadvertently mutate internal in-memory state.
- **Strict Validation**: Middleware validates fields prior to reaching controllers, rejecting malformed bodies with standard `{ success: false, errors: { ... } }` payloads.

### Frontend Architecture
```
Frontend/src/
├── main.jsx             # React DOM entry point
├── App.jsx              # BrowserRouter & top-level route configuration
├── index.css            # Global CSS custom properties (design system tokens) & resets
├── components/          # Reusable UI components
│   ├── Badges/          # StatusBadge & PriorityBadge
│   ├── Dashboard/       # TaskMetrics, TaskFilters, Pagination
│   ├── Layout/          # Sticky glassmorphism header & responsive shell
│   ├── TaskCard/        # Task card with actions & quick advance
│   ├── TaskForm/        # Reusable task create/edit form
│   └── UI/              # ConfirmModal, EmptyState, ErrorAlert, LoadingSkeleton
├── pages/               # Route views (Dashboard, CreateTask, EditTask, TaskDetail, NotFound)
├── services/            # taskApi.js centralized fetch client
└── utils/               # formatters.js (dates, labels, overdue calculation)
```

- **Scoped CSS Modules**: Components have dedicated `.module.css` files, preventing global style leaks while utilizing centralized design tokens from `index.css`.
- **Centralized API Service**: Components never invoke `fetch()` directly; all HTTP operations flow through `services/taskApi.js` with structured error normalization.

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 | Declarative UI components & hooks |
| | Vite 5 | High-speed frontend build tool & dev server |
| | React Router DOM 6 | Client-side routing (`/`, `/tasks/new`, `/tasks/:id`, etc.) |
| | CSS Modules & Vanilla CSS | Scoped styling with design system tokens |
| **Backend** | Node.js 18+ | JavaScript runtime (native ES Modules) |
| | Express.js 4 | REST API routing and middleware framework |
| | `crypto.randomUUID()` | Built-in UUID v4 generation |
| | CORS & dotenv | Cross-origin requests & environment configuration |
| **Tooling & Docs** | Postman 2.1 | API testing collection |
| | OpenAPI 3.0.3 | Industry-standard API contract specification |
| | ESLint 9 | Code quality & formatting standards |

---

## 📂 Directory Structure

```text
assignment_cleanomatics/
├── Backend/
│   ├── package.json
│   ├── .env.example
│   ├── scripts/
│   │   ├── testService.mjs     # 34 automated service unit tests
│   │   └── testApi.mjs         # 54 automated HTTP integration tests
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── controllers/
│       │   └── taskController.js
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── routes/
│       │   └── taskRoutes.js
│       ├── services/
│       │   ├── taskService.js
│       │   └── taskStore.js
│       └── utils/
│           └── AppError.js
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── utils/
├── docs/
│   ├── Cleanomatics_Task_Management_API.postman_collection.json
│   └── openapi.yaml
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

---

### 1. Backend Setup

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Default `.env` configuration:*
   ```env
   PORT=5001
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the backend server:
   - **Development mode (auto-reload)**:
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```
   *The server starts on `http://localhost:5001`.*

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Default `.env` configuration:*
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

5. To build for production:
   ```bash
   npm run build
   ```

---

## 🔌 API Reference

Base URL: `http://localhost:5001/api`

### REST Endpoints

| Method | Endpoint | Description | Request Body | Success Status |
|---|---|---|---|---|
| `GET` | `/health` | Server health check | None | `200 OK` |
| `GET` | `/api/tasks` | Get all tasks | None | `200 OK` |
| `POST` | `/api/tasks` | Create a new task | `{ title, description, status?, priority?, dueDate? }` | `201 Created` |
| `GET` | `/api/tasks/:id` | Get task by UUID | None | `200 OK` |
| `PUT` | `/api/tasks/:id` | Update task by UUID | `{ title?, description?, status?, priority?, dueDate? }` | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Delete task by UUID | None | `200 OK` |

### Response Envelope Standards

**Success Response (Single Item):**
```json
{
  "success": true,
  "data": {
    "id": "8a9c2db2-2df4-4682-9598-a1f9453c0765",
    "title": "Design user flow",
    "description": "Wireframe the dashboard layout and details views",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-11-20",
    "createdAt": "2026-10-12T16:00:00.000Z",
    "updatedAt": "2026-10-12T16:00:00.000Z"
  }
}
```

**Success Response (List):**
```json
{
  "success": true,
  "count": 1,
  "data": [ ... ]
}
```

**Validation Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required and cannot be blank",
    "priority": "Priority must be one of: low, medium, high"
  }
}
```

**Not Found Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task with id ... not found"
}
```

---

## 📖 API Documentation & Tooling

Complete API documentation files are located in the [`docs/`](./docs) folder:

1. **Postman Collection**: [`docs/Cleanomatics_Task_Management_API.postman_collection.json`](./docs/Cleanomatics_Task_Management_API.postman_collection.json)
   - Import into Postman (Import > Drag & Drop).
   - Set the `baseUrl` variable (defaults to `http://localhost:5001`).
   - Includes full test scripts asserting HTTP response statuses and data types.
2. **OpenAPI 3.0 Specification**: [`docs/openapi.yaml`](./docs/openapi.yaml)
   - View interactively in [Swagger Editor](https://editor.swagger.io/) or Redoc.

---

## 🧪 Testing & Quality Assurance

Both frontend and backend are thoroughly covered by automated test suites and linting checks:

### Backend Test Suites
Run from within `Backend/`:
```bash
# Run 34 unit tests for data model, validation, and service logic
npm run test:service

# Run 54 HTTP integration tests covering all routes, status codes, and error cases
npm run test:api
```
**Total Backend Tests:** **88 passing tests, 0 failures.**

### Frontend Quality Checks
Run from within `Frontend/`:
```bash
# Run ESLint check
npm run lint

# Run production build compilation
npm run build
```
**Results:** **0 lint errors, 0 warnings, clean production bundle.**

---

## 📝 Author & Submission

Developed with clean architecture principles, modern standards, and disciplined task-by-task Git version control.

# 101429091_comp3133_assignment2

**COMP3133 Full Stack Development II — Assignment 2**
Student: Hamzah Hafez | ID: 101429091 | George Brown College

---

## Project Structure

```
101429091_comp3133_assignment2/
├── docker-compose.yml          # Combined orchestration
├── .env.example                # Environment variable template
├── .gitignore
├── backend/                    # Assignment 1 backend (Node/Apollo/MongoDB)
│   └── ...                     # (your existing repo)
├── backend-additions/
│   └── searchEmployees.js      # New resolver to add to backend
└── frontend/                   # Angular 17 frontend (this assignment)
    ├── Dockerfile
    ├── nginx.conf
    ├── angular.json
    ├── package.json
    └── src/
        ├── environments/
        │   ├── environment.ts          # Dev: points to localhost:5000
        │   └── environment.prod.ts     # Prod: update with deployed URL
        └── app/
            ├── app.module.ts
            ├── app-routing.module.ts
            ├── graphql.module.ts       # Apollo client setup
            ├── core/
            │   ├── graphql/queries.ts  # All GQL queries & mutations
            │   ├── guards/auth.guard.ts
            │   ├── interceptors/auth.interceptor.ts
            │   └── services/
            │       ├── auth.service.ts
            │       └── employee.service.ts
            ├── shared/pipes/
            │   ├── salary.pipe.ts
            │   └── default-avatar.pipe.ts
            └── features/
                ├── auth/
                │   ├── login/          # Login screen
                │   └── signup/         # Signup screen
                └── employees/
                    ├── shell/          # Sidebar nav wrapper
                    ├── list/           # Employee table + search
                    ├── add/            # Add employee form
                    ├── edit/           # Edit employee form
                    └── detail/         # Employee detail view
```

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Framework  | Angular 17 (NgModules)                        |
| GraphQL    | Apollo Angular 7 + `@apollo/client` 3         |
| UI         | Angular Material 17 (dark theme)              |
| Forms      | Reactive Forms with custom validators         |
| Routing    | Angular Router with lazy-loaded modules       |
| Auth       | JWT stored in localStorage, AuthGuard         |
| HTTP       | HttpInterceptor injects `Authorization` header|
| Styling    | Component SCSS + global CSS variables         |
| Deployment | Docker + nginx (frontend), Node (backend)     |

---

## Features

### Authentication
- **Login** — Reactive form, username + password, JWT stored in localStorage
- **Signup** — Username, email, password with confirm-password validator
- **Session persistence** — Token survives page refresh
- **AuthGuard** — Redirects unauthenticated users to `/login`
- **Logout** — Clears token + Apollo store cache, redirects to login

### Employee Management (full CRUD)
- **List** — Material table with sort, pagination (10/25/50), row click to view
- **Add** — Full form with photo upload (base64), all required fields
- **Edit** — Pre-populated form, supports photo change
- **Detail** — Dedicated profile view with all fields
- **Delete** — Confirmation dialog, refetches list on success

### Search
- **Global filter** — Client-side instant filter across all columns
- **GraphQL search** — Department + designation dropdowns trigger `searchEmployees` query
- Active search badge shows current filters, "Clear" resets to full list

### UX
- Dark editorial design system with CSS custom properties
- Syne display font + DM Sans body font
- Responsive sidebar navigation
- Page fade-up entrance animation
- Hover-reveal action buttons in table rows
- Salary formatted as CAD currency via custom pipe

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- Angular CLI 17: `npm install -g @angular/cli`
- Assignment 1 backend running on `http://localhost:5000`

### 1 — Clone & install

```bash
git clone https://github.com/Datadan82/101429091_comp3133_assignment2.git
cd 101429091_comp3133_assignment2/frontend
npm install
```

### 2 — Update backend

Add `searchEmployees` to your Assignment 1 backend by following the instructions in `backend-additions/searchEmployees.js`.

Ensure CORS allows `http://localhost:4200`:

```js
app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));
```

### 3 — Run

```bash
# Terminal 1 — backend (in your Assignment 1 folder)
npm start

# Terminal 2 — frontend
cd frontend
ng serve
```

Open **http://localhost:4200**

---

## Docker Deployment

```bash
# Copy .env.example to .env and fill in values
cp .env.example .env

# Build and start both services
docker-compose up --build
```

Frontend → http://localhost:80
Backend  → http://localhost:5000/graphql

---

## Cloud Deployment (Vercel)

### Backend
1. Push Assignment 1 repo to GitHub
2. Import into Vercel, set environment variables (`MONGO_URI`, `JWT_SECRET`)
3. Note the deployed URL e.g. `https://your-backend.vercel.app`

### Frontend
1. Update `src/environments/environment.prod.ts`:
   ```ts
   graphqlUri: 'https://your-backend.vercel.app/graphql'
   ```
2. Push this repo to GitHub
3. Import into Vercel — it auto-detects Angular, set build command to `ng build`

---

## GraphQL Operations Used

| Operation          | Type     | Description                          |
|--------------------|----------|--------------------------------------|
| `login`            | Mutation | Authenticate user, receive JWT       |
| `signup`           | Mutation | Register new user, receive JWT       |
| `getAllEmployees`   | Query    | Fetch full employee list             |
| `getEmployeeById`  | Query    | Fetch single employee                |
| `searchEmployees`  | Query    | Filter by department and/or position |
| `addEmployee`      | Mutation | Create new employee record           |
| `updateEmployee`   | Mutation | Update existing employee             |
| `deleteEmployee`   | Mutation | Remove employee record               |

---

## Assignment Checklist

- [x] Angular app initialized with correct naming convention
- [x] GitHub repository: `Datadan82/101429091_comp3133_assignment2`
- [x] Routing for Login, Signup, Employee components
- [x] Reactive Forms with validation on Login and Signup
- [x] JWT session stored via AuthService (DI)
- [x] Employee list in tabular format after login
- [x] Add Employee with photo upload
- [x] View Employee detail screen
- [x] Edit Employee form
- [x] Delete Employee with confirmation
- [x] Search by department and designation (new GraphQL API)
- [x] Angular Material UI — responsive, dark theme
- [x] Logout clears session and redirects to login
- [x] Custom pipes: `salary`, `defaultAvatar`
- [x] AuthGuard protecting employee routes
- [x] AuthInterceptor attaching JWT to all requests
- [x] Docker Compose for combined deployment
- [x] Dockerfile + nginx config for frontend

# Eduvo Demo Request & Follow-up Management System

A production-quality Demo Request and Follow-up Management Module built for Eduvo, following an editorial, minimal, and professional design philosophy. The application handles the entire lifecycle of a school demo request, from public submission to final conversion, with strict role-based access control.

## Tech Stack
* **Frontend**: React 19, Vite, Tailwind CSS v4, React Router, Axios, Recharts
* **Backend**: Express.js, MySQL, Sequelize ORM, JWT, bcrypt
* **Testing**: Jest, Supertest

## Features
- **Public Demo Request**: A sleek, responsive public form with validations and duplicate prevention.
- **Role-Based Access**: Secure login and separate views for `ADMIN` and `SALES_EXECUTIVE`.
- **Dashboard**: High-level statistics and charting for conversion tracking.
- **Workflow Engine**: Strict status transitions (New -> Contacted -> Scheduled -> Completed -> Converted/Lost).
- **Activity Logging**: Automated tracking of status changes, re-assignments, and scheduling.
- **Notes & Follow-ups**: Appending notes to lead profiles.
- **Responsive Design**: Fully mobile-responsive interface leveraging Tailwind CSS.

---

## Setup Instructions

### 1. Database
Ensure you have MySQL running locally on port 3306.
Create the database:
```sql
CREATE DATABASE eduvo_crm;
```
> **Note for Reviewers:** The raw database schema and structure can be found in `server/database.sql` as requested in the submission guidelines. Note that Sequelize `sync()` automatically creates these tables at runtime, but the SQL file is provided for reference.

### 2. Environment Variables
Copy `.env.example` to `.env` in the `server` directory and configure your credentials.

**server/.env**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=eduvo_crm
DB_USER=root
DB_PASSWORD=your_db_password
JWT_SECRET=super_secret_jwt_key
PORT=5000
```

### 3. Backend Setup
```bash
cd server
npm install
npm run seed      # Seed the database with sample users and data
npm test          # Run backend tests
npm run dev       # Start the server (runs on port 5000)
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev       # Start the Vite dev server (runs on port 5173)
```

---

## Sample Login Credentials

Running `npm run seed` in the `server` directory automatically provisions the following default users:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@eduvo.com` | `admin123` |
| **Sales Executive** | `sales@eduvo.com` | `sales123` |

---

## API Documentation

A fully comprehensive and localized **Postman Collection** is provided in the repository root:
`eduvo_postman_collection.json`

1. Open Postman.
2. Click **Import** and select this JSON file.
3. The collection contains 9 well-documented endpoints for Auth, Demo Requests (Public & Admin), Metrics, and Utilities, completely covering the API surface with realistic Indian market sample payloads.

---

## Assumptions & Incomplete Features

### Assumptions
* **Local Database**: The system assumes a local instance of MySQL is accessible.
* **Seeding Behavior**: The `seed.js` script intentionally resets passwords for default accounts when run, ensuring the sample credentials provided above are always valid for reviewers.
* **Role Redirection**: Upon login, `ADMIN` users are dynamically routed to `/admin/dashboard`, while `SALES_EXECUTIVE` users are routed to `/admin/requests`. The `ProtectedRoute` component strictly enforces URL access.

### Incomplete Features / Future Enhancements
* **Email Integrations**: Automated follow-up reminders and confirmation emails are not yet implemented (would require `nodemailer` or an ESP like SendGrid).
* **JWT Refresh Tokens**: Currently uses a standard short-lived JWT mechanism. True production readiness would require a refresh-token rotation pipeline.
* **Frontend Tests**: While backend APIs are unit tested via Jest and Supertest, frontend UI and E2E tests (e.g., via Cypress or Playwright) are not currently included.

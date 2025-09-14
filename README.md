# Appointment Management System

A full-stack appointment management system consisting of:

- A frontend built with Angular located in `frontend/`
- A backend Web API built with ASP.NET Core (.NET 8) located in `backend/`

This README combines setup, run, and deployment instructions for both parts so you can run the whole system locally or in containers.

## Features

- Book appointments with patient and doctor information
- View all scheduled appointments
- Edit and cancel appointments
- Responsive UI and form validation on the frontend
- REST API for appointments on the backend

## Prerequisites

- Node.js (v18 or higher) and npm (for the frontend)
- Angular CLI (v20+) — optional but helpful for development
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (for the backend)
- Docker (optional, for containerized deployment)

## Quick repo layout

- `frontend/` — Angular app
- `backend/` — ASP.NET Core Web API

## Full setup — Backend

1. Open a terminal and navigate to the backend folder:

```sh
cd AppointmentManagementSystem/backend
```

2. Restore dependencies and build:

```sh
dotnet restore
dotnet build
```

3. Run the API locally:

```sh
dotnet run
```

By default the API will be available at `http://localhost:5000` (or another port if configured in `appsettings.json` or via environment variables).

Docker (backend):

```sh
docker build -t appointment-management-system-backend .
docker run -d -p 5000:5000 appointment-management-system-backend
```

Notes / assumptions for backend:

- The backend ships with a `Dockerfile` for container builds.
- No authentication is enabled by default — this project is intended for demo/dev use.
- Configure the database connection string and secrets with environment variables in production.

## Full setup — Frontend

1. Open a terminal and navigate to the frontend folder:

```sh
cd AppointmentManagementSystem/frontend
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm start
# or
ng serve
```

4. Open the app in your browser at `http://localhost:4200/` (or the port shown in the terminal).

Frontend configuration:

- The frontend expects the backend API base URL in `src/app/environments/environment.ts`. By default this is set to `http://localhost:5050` in this project — update it to match the backend (for example, `http://localhost:5000`) if needed.

API endpoints used by the frontend:

- `GET /Appointments` — retrieve all appointments
- `POST /Appointments` — create a new appointment
- `PUT /Appointments/{id}` — update an existing appointment
- `DELETE /Appointments/{id}` — delete an appointment

Build frontend for production:

```sh
npm run build:prod
```

The build artifacts will be in `dist/`.

## Running both locally

1. Start the backend (from `backend/`):

```sh
dotnet run
```

2. Start the frontend (from `frontend/`):

```sh
npm start
```

Make sure the frontend `environment.ts` `baseUrl` matches the backend address and port. If the backend runs at `http://localhost:5000`, set the frontend baseUrl accordingly.

## Docker — Full-stack

You can build and run each piece in its own container. Example quick steps:

Backend container:

```sh
docker build -t appointment-management-backend ./backend
docker run -d -p 5000:5000 appointment-management-backend
```

Frontend container (example using a multi-stage build from earlier):

```sh
docker build -t appointment-management-frontend ./frontend
docker run -d -p 80:80 appointment-management-frontend
```

When deploying, point the frontend at the backend container address (or use a reverse proxy / ingress) and configure environment variables for connection strings and ports.

## Assumptions

- The project is intended primarily for development and demonstration.
- Default config values in `appsettings.json` (backend) and `environment.ts` (frontend) are suitable for local development.
- CORS must be enabled on the backend to allow requests from the frontend origin.
- No authentication is included by default.
- Appointment times are handled in ISO 8601 format.

## API Reference (summary)

- GET /Appointments — returns a list of appointments
- POST /Appointments — create an appointment (expects appointment payload)
- PUT /Appointments/{id} — update appointment by id
- DELETE /Appointments/{id} — delete appointment by id

## Technologies

- Frontend: Angular 20, TypeScript, RxJS, Tailwind CSS
- Backend: ASP.NET Core (.NET 8), C#

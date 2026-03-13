# Inductly

---

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL / MySQL

---

## Prerequisites

Make sure you have installed:

- Node.js (>=18)
- npm / pnpm / yarn
- Git
- Database (PostgreSQL / MySQL)
- Docker Engine
- WSL2 (optional)
- Prettier Extension

Check installation:

```bash
node -v
npm -v
```

---

## Clone the Repository

```bash
git clone https://github.com/Anurag-Ranjan/inductly.git
cd inductly
```

---

## Install Dependencies

```bash
cd frontend
npm install
cd ..
cd backend
npm install
```

---

## Setup Environment Variables

Create a `.env` file in the backend directory.

You can copy the example file:

```bash
cd backend
cp .env.example .env
```

Example `.env` variables:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
PORT=5000
JWT_SECRET=
NODE_ENV="development"
```

---

## Database Setup

(Inside the backend folder)

Make sure that the docker desktop engine is running

Start PostgreSQL using Docker:

```bash
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16
```

Run migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

---

## Run the Development Server

Backend:

```bash
cd backend
npm run dev
```

Server will start at:

```
http://localhost:8000
```

Frontend:

```bash
cd frontend
npm run dev
```

---

## Useful Commands

Start development server

```bash
npm run dev
```

Build project

```bash
npm run build
```

Start production server

```bash
npm start
```

---

## Notes

- Do not commit `.env`
- Always run migrations before starting the server
- Follow the project coding conventions

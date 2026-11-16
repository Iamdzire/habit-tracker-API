```md
# Habit Tracker API

Backend API for tracking personal habits and daily check-ins.

## Features

- User registration and login (JWT)
- Role-based access (`user` / `admin`)
- Habit CRUD
- Check-in create, list, update, delete
- One check-in per habit per day (unique index)
- Pagination, filtering, and sorting
- Input validation with express-validator
- Security with Helmet and rate limiting
- Automated tests with Jest + Supertest

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt
- express-validator
- Helmet
- express-rate-limit
- Jest, Supertest, mongodb-memory-server

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd habit-tracker-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 4. Run the server

```bash
npm run dev
```

Server default:

```text
http://localhost:3000
```

### 5. Run tests

```bash
npm test
```

## API Routes

### Auth

- `POST /api/auth/create` — register
- `POST /api/auth/login` — login
- `GET /api/auth/` — get all users (admin only)
- `GET /api/auth/:id` — get one user (owner or admin)
- `PUT /api/auth/:id` — update user (owner or admin)
- `DELETE /api/auth/:id` — delete user (owner or admin)

### Habits

- `POST /api/habits` — create habit
- `GET /api/habits` — get my habits
- `GET /api/habits/:id` — get one habit
- `PUT /api/habits/:id` — update habit
- `DELETE /api/habits/:id` — delete habit
- `GET /api/habits/:id/check-ins` — get check-ins for one habit

### Check-ins

- `POST /api/check-ins` — create check-in
- `GET /api/check-ins` — get my check-ins
- `GET /api/check-ins/:id` — get one check-in
- `PUT /api/check-ins/:id` — update check-in
- `DELETE /api/check-ins/:id` — delete check-in

## Query Examples

```text
GET /api/habits?page=1&limit=5
GET /api/habits?frequency=Daily
GET /api/habits?sort=newest
GET /api/habits?name=read&page=1&limit=5&sort=title
```

## Auth Header

For protected routes, send:

```text
Authorization: Bearer <your_token>
```

## Project Structure

```text
.
├── app.js
├── server.js
├── package.json
├── .env.example
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   └── tests
```

## Notes

- Passwords are hashed with bcrypt
- JWT protects private routes
- Users can only access their own data unless they are admin
- `.env` should never be committed to GitHub
```


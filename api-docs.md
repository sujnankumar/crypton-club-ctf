# API Documentation

## Authentication

### Register
- **POST** `/api/auth/register`
- Body: `{ "username": "string", "email": "string", "password": "string" }`

### Login
- **POST** `/api/auth/callback/credentials` (Handled by NextAuth)

## Challenges

### List Challenges
- **GET** `/api/challenges`
- Returns list of challenges.
- Admin: sees all challenges + flags.
- Player: sees visible challenges, no flags, with `solved` status.

### Get Challenge
- **GET** `/api/challenges/:id`
- Returns challenge details.

### Create Challenge (Admin)
- **POST** `/api/challenges`
- Body: `{ "title": "string", "category": "string", "points": number, "flag": "string", "description": "string" }`

### Update Challenge (Admin)
- **PUT** `/api/challenges/:id`

### Delete Challenge (Admin)
- **DELETE** `/api/challenges/:id`

### Submit Flag
- **POST** `/api/challenges/:id/submit`
- Body: `{ "flag": "string" }`
- Returns: `{ "correct": boolean, "message": "string", "points": number }`

## Users (Admin Only)

### List Users
- **GET** `/api/users`

### Create User
- **POST** `/api/users`

### Update User
- **PUT** `/api/users/:id`

### Delete User
- **DELETE** `/api/users/:id`

## Announcements

### List Announcements
- **GET** `/api/announcements`

### Create Announcement (Admin)
- **POST** `/api/announcements`

### Delete Announcement (Admin)
- **DELETE** `/api/announcements/:id`

## Scoreboard

### Get Scoreboard
- **GET** `/api/scoreboard`
- Returns: `[{ "username": "string", "total_points": number, "solve_count": number, "last_solve": "date" }]`

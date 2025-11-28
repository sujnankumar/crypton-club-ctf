# CTF Platform

A lightweight, fully featured Capture The Flag platform built with Next.js 14, MongoDB, and Tailwind CSS.

## Features

- **Authentication**: Secure login/register with role-based access (Admin/Player).
- **Admin Dashboard**: Manage users, challenges, announcements, and view submissions.
- **Player Dashboard**: View challenges, submit flags, track progress, and view scoreboard.
- **Challenge System**: Support for various categories, points, markdown descriptions, and file downloads.
- **Scoreboard**: Real-time ranking based on points and solve time.
- **Security**: Server-side route protection, rate limiting, and secure flag storage.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas (Mongoose)
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js v5
- **Deployment**: Vercel ready

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (Free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ctf_host
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `AUTH_SECRET`: Random string for session encryption (generate with `openssl rand -base64 32`)
   - `AUTH_URL`: `http://localhost:3000` (local) or your production URL

4. **Seed Database**
   Populate the database with an admin user and sample challenges:
   ```bash
   npx tsx seed.ts
   ```
   
   Default Admin:
   - Email: `admin@ctf.local`
   - Password: `admin123`

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variables (`MONGODB_URI`, `AUTH_SECRET`, `AUTH_URL`).
   - Note: Set `AUTH_URL` to your Vercel deployment URL (e.g., `https://your-project.vercel.app`).
4. Deploy!

## API Documentation

See [api-docs.md](api-docs.md) for detailed API endpoint documentation.

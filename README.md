# BooksGod

**BooksGod** is a Next.js application designed for managing and exploring books. It incorporates the latest features and best practices of Next.js 14, providing a comprehensive platform for both readers and authors. Below is an overview of its features and technologies.

## Overview

**About:**
This is a side project of mine aimed at implementing and understanding the latest Next.js features and best practices. Users can log in, search for books, read, and register as authors to write their own books. Authors can utilize the provided editor to write, save drafts, and publish. It supports book cover uploads, details, and allows paid book purchases for users.

## Features

- **Reader and Editor:**
  - Users can read books, and authors can write and edit books using the provided editor.

- **User-friendly Dashboard:**
  - Both users and authors have a dashboard for managing their activities.

- **Image Upload with AWS S3:**
  - Authors can upload book cover images seamlessly.

- **Filter Options and Search:**
  - Users can filter and search for books with infinite pagination.

- **Community Features:**
  - Users and authors can engage in a community.

- **Optimistic Updates:**
  - Optimistic updates for a smoother user experience.

- **Redis Caching:**
  - Efficient caching using Redis.

- **Authentication with Clerk:**
  - Secure authentication using Clerk.

- **Validations with Zod:**
  - Robust validations implemented with Zod.

- **Drizzle ORM and Database - PlanetScale:**
  - Database management with Drizzle ORM and PlanetScale.

- **Rate Limiting:**
  - Implemented to prevent abuse and ensure fair usage.

- **Book Purchasing with Stripe:**
  - Secure transactions for purchasing books.

- **Loading States with Suspense:**
  - Enhanced user experience with Suspense for loading states.

- **UI Component Library - NextUi:**
  - Utilizes the NextUi component library for a consistent UI.

- **Styled with Tailwind CSS:**
  - Responsive and visually appealing design with Tailwind CSS.

- **Deployed on Vercel Edge:**
  - Deployed on Vercel Edge for efficient performance.

- **TRPC and React Server Components:**
  - Utilizes TRPC and React Server Components for efficient server-client interaction.

## To-Do List:

- Documentation for Authors
- More Author Features
- Auto-Save Editor Functionality
- Reading Preferences

## Installation

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and update the variables:

   ```sh
   cp .env.example .env.local
   ```

3. Start the development server:

   ```sh
   pnpm dev
   ```

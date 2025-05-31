# Enterprise Core

Enterprise Core is a modern, full-stack application designed to manage field operations, including customers, associates, jobs, scheduling, and reporting. Built with React, TypeScript, and Supabase on the backend, Enterprise Core provides a responsive, intuitive interface for administrators and field technicians to track and update work in real time.

## Table of Contents

1. Features
2. Technology Stack
3. Getting Started

   1. Prerequisites
   2. Installation
   3. Running in Development
   4. Building for Production
4. Project Structure
5. Environment Variables
6. Database & Auth Setup
7. Contributing
8. License

---

## Features

* Dashboard: Real-time metrics (total customers, active jobs, revenue, etc.) and recent activity feed.
* Customer Management: View, search, and manage customer profiles.
* Associate Management: Track associates’ availability, skills, and assignments.
* Job Management: Create, assign, and update jobs with status, priority, and timeline entries.
* Scheduling: Month/week/day calendar views for scheduled jobs and available associates.
* Authentication: Secure user authentication with role-based access (admin vs. regular user).
* Dark Mode: System-preference-based light/dark themes for all UI components (cards, modals, forms).
* Row-Level Security (RLS): All data is scoped per user to ensure data privacy.
* Responsive Design: Mobile-first layout using Tailwind CSS and shadcn-ui components.

---

## Technology Stack

Frontend

* React (v18+) with TypeScript
* Vite as the build tool
* Tailwind CSS for styling
* shadcn-ui (Radix + Tailwind) for accessible UI primitives
* React Router v6 for client-side routing
* TanStack React Query for data fetching and caching
* Recharts for basic dashboards and charts

Backend

* Supabase (PostgreSQL + Auth)
* Row-Level Security (RLS) policies for user-scoped data
* UUID primary keys via uuid\_generate\_v4()
* Trigger functions to auto-populate user profiles on signup
* Real-time subscriptions (optional) for live updates

Dev Tools

* TypeScript for static typing
* ESLint + Prettier for code quality
* Husky (optional) for Git hooks
* GitHub Actions (optional) for CI/CD

---

## Getting Started

### Prerequisites

* Node.js ≥ v16
* npm or yarn
* Supabase CLI (for local development & migrations)
* Git (for cloning the repository)

### Installation

1. Clone the repository
   git clone [https://github.com/your-org/enterprise-core.git](https://github.com/your-org/enterprise-core.git)
   cd enterprise-core

2. Install dependencies
   npm install
   or
   yarn install

3. Set up environment variables
   Copy .env.example to .env and fill in your Supabase credentials (see Environment Variables).

4. Initialize the database
   Ensure your Supabase project is created and the supabase CLI is authenticated. Then run:
   supabase db reset
   supabase db push

   This will apply all SQL migrations (create tables, RLS policies, triggers).

---

### Running in Development

Start the Vite development server:
npm run dev
or
yarn dev

The app will run at [http://localhost:5173/](http://localhost:5173/) by default. Supabase client is configured in src/lib/supabase.ts. Any changes to React components or styles will hot-reload automatically.

---

### Building for Production

To build a production-ready bundle:
npm run build
or
yarn build

The build artifacts will be generated in the dist/ directory. You can then deploy to any static hosting provider or serve via an Express/Node server if needed.

---

## Project Structure

enterprise-core/
├── public/                  # Static assets (favicon, robots.txt, index.html template)
├── src/
│   ├── assets/              # Images, logos, and static assets
│   ├── components/          # Reusable UI components (cards, modals, forms)
│   │   ├── cards/
│   │   ├── modals/
│   │   ├── Buttons.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── features/
│   │   ├── dashboard/       # Dashboard page + subcomponents
│   │   ├── customers/       # Customer list, details, modals
│   │   ├── associates/      # Associate list, details, modals
│   │   ├── jobs/            # Job list, overview, timeline, tasks, modals
│   │   ├── scheduling/      # Scheduling calendar views
│   │   └── settings/        # User profile & application settings
│   ├── hooks/               # Custom React hooks (e.g., useJobs, useCustomers)
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client initialization
│   │   └── utils.ts         # Utility functions (date formatting, etc.)
│   ├── pages/               # Top-level route components (DashboardPage, JobsPage, etc.)
│   ├── routes/              # React Router route definitions
│   ├── types/               # TypeScript interfaces & enums (Job, Customer, Associate, etc.)
│   ├── App.tsx              # Root React component (providers, theme context)
│   ├── main.tsx             # Entry point (render)
│   └── index.css            # Tailwind base, utilities, and custom styles
├── supabase/
│   ├── migrations/          # SQL migration files (create tables, RLS policies, triggers)
│   └── functions/           # Supabase Edge Functions (optional)
├── .env.example             # Example environment variables file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md                # You are here

---

## Environment Variables

Create a .env file in the project root with the following values:

VITE\_SUPABASE\_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
VITE\_SUPABASE\_KEY=public-anon-key

* VITE\_SUPABASE\_URL: Your Supabase project URL.
* VITE\_SUPABASE\_KEY: The public anon key. Do NOT commit your service\_role key to version control.

---

## Database & Auth Setup

1. Supabase Project

   * Create a new Supabase project.
   * Under “Authentication,” configure email/password sign-up and any OAuth providers.
   * In “Settings → Database → Extensions,” enable the uuid-ossp extension.

2. Migrations
   All SQL migrations (tables, enums, RLS policies, triggers) live in supabase/migrations/.
   When you modify schema, generate a new migration, then run:
   supabase db diff        # See pending changes
   supabase db push        # Apply changes

3. Row-Level Security (RLS)
   RLS policies are declared alongside table creation.

   * Each table has RLS enabled.
   * Policies restrict access to rows where user\_id = auth.uid() or if is\_admin() = TRUE.

4. Trigger Functions

   * handle\_new\_user(): Automatically inserts a row into public.users on auth.users sign-up.
   * update\_updated\_at\_column(): Updates updated\_at on row modifications.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch
   git checkout -b feature/your-feature-name
3. Install dependencies & run the app locally
   npm install
   npm run dev
4. Create a pull request with a clear description of your changes.

Please ensure:

* TypeScript types are updated whenever you modify interfaces.
* Tailwind classes include dark: variants if adding new UI components.
* Any new Supabase schema changes have corresponding migration files.

---

## License

This project is licensed under the MIT License. See LICENSE for details.

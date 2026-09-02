# Mystery Messenger

Mystery Messenger is an anonymous feedback application built while learning Next.js. A person can create an account, share a public profile link, receive anonymous messages, and manage those messages from a protected dashboard.

<img width="1914" height="936" alt="image" src="https://github.com/user-attachments/assets/27cb8c1b-604f-4680-818e-0f57c2621911" />

## Features

- Account signup with username, email, and password
- Password hashing with `bcryptjs`
- Credentials authentication with NextAuth
- MongoDB persistence through Mongoose
- Public anonymous message profiles at `/u/[username]`
- Username lookup from the `/send-message` page
- Dashboard for viewing and deleting received messages
- Switch for accepting or stopping new messages
- Server-side request validation with Zod

Email verification is currently disabled. New accounts are marked as verified during signup and are redirected to the sign-in page. The verification-related files remain in the project as unused code for now.

## Requirements

- Node.js 20 or newer
- npm
- A MongoDB database, local or hosted

## Setup

Install the dependencies:

```bash
npm install
```

Create an environment file in the project root. You can use `.sample.env` as a starting point:

```bash
Copy-Item .sample.env .env.local
```

Set the required values in `.env.local`:

```env
MONGO_URI="mongodb://localhost:27017/mystery-messanger"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
```

`RESEND_API_KEY` is not required while email verification is disabled. Add your API key to sned verification emails. 

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The available application flow is:

```text
/sign-up
	-> account is created as verified
	-> /sign-in
	-> /dashboard
```

To send a message:

```text
/send-message
	-> enter a verified username
	-> /u/[username]
	-> submit an anonymous message
```

Users can also share their direct profile URL, such as `/u/example_user`.

## Useful Commands

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Project Structure

```text
src/
	app/
		(auth)/       Authentication pages
		(app)/        Main application pages
		api/          Route handlers for authentication and messaging
	components/     Shared React components
	context/        NextAuth session provider
	helpers/        Server-side helpers
	lib/            Database, email, and utility modules
	model/          Mongoose models
	schemas/        Zod validation schemas
	types/          Shared TypeScript and NextAuth types
emails/           Verification email component kept for future use
public/            Static assets
```

## API Routes

| Route                             | Method        | Purpose                              | Authentication   |
| --------------------------------- | ------------- | ------------------------------------ | ---------------- |
| `/api/sign-up`                    | `POST`        | Create an account                    | Public           |
| `/api/auth/[...nextauth]`         | `GET`, `POST` | Sign in and manage NextAuth sessions | Public           |
| `/api/check-username`             | `GET`         | Check signup username availability   | Public           |
| `/api/find-user`                  | `GET`         | Check whether a username exists      | Public           |
| `/api/send-message`               | `POST`        | Send an anonymous message            | Public           |
| `/api/get-messages`               | `GET`         | Load the signed-in user’s messages   | Required         |
| `/api/delete-message/[messageid]` | `DELETE`      | Delete one owned message             | Required         |
| `/api/accept-message`             | `GET`, `POST` | Read or update message acceptance    | Required         |
| `/api/verify-code`                | `POST`        | Legacy verification endpoint         | Unused currently |

## Learning Focus

This project demonstrates the Next.js App Router, route handlers, dynamic routes, client components, authentication, database access, validation, and protected server operations in one application.

Useful next improvements include adding automated API tests, moving messages to a separate collection for larger workloads, and re-enabling email verification when a verified email domain is available.

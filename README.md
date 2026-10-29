This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

The following environment variables are required:

- `DATABASE_URL` - PostgreSQL database connection string
- `BOT_API_SECRET` - Secret token for authenticating bot API requests (required for `/api/bot/*` endpoints)

## Bot API

The application includes a bearer-token-protected bot API for automated athlete data management. All endpoints require a valid bearer token in the `Authorization` header.

### Authentication

Include the bearer token in the `Authorization` header:

```
Authorization: Bearer YOUR_BOT_API_SECRET
```

### Endpoints

#### 1. Athlete Lookup by Name

Search for athletes by name (case-insensitive partial match).

**Endpoint:** `GET /api/bot/athlete/{name}`

**Parameters:**
- `name` (path parameter) - The athlete name or partial name to search for

**Rate Limit:** 60 requests per minute

**Example:**

```bash
curl -X GET "https://your-domain.com/api/bot/athlete/John%20Doe" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"
```

**Response:**

```json
{
  "count": 1,
  "athletes": [
    {
      "id": "abc123",
      "name": "John Doe",
      "gender": "MALE",
      "age": 28,
      "weightDivision": "Men's Lightweight",
      "country": "US",
      "wins": 15,
      "losses": 2,
      "draws": 0,
      "winsByKo": 8,
      "winsBySubmission": 5,
      "followers": 50000,
      "rank": 3,
      "poundForPoundRank": 0,
      "retired": false
    }
  ]
}
```

#### 2. Update Athlete Stats

Update only the statistics for an athlete (wins, losses, draws, KO wins, submission wins, followers). Uses the same cache invalidation strategy as the dashboard.

**Endpoint:** `PATCH /api/bot/athlete/{id}/stats`

**Parameters:**
- `id` (path parameter) - The athlete ID

**Request Body:** (at least one field required)

```json
{
  "wins": 16,
  "losses": 2,
  "draws": 0,
  "winsByKo": 9,
  "winsBySubmission": 5,
  "followers": 52000
}
```

**Rate Limit:** 30 requests per minute

**Example:**

```bash
curl -X PATCH "https://your-domain.com/api/bot/athlete/abc123/stats" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "wins": 16,
    "losses": 2,
    "followers": 52000
  }'
```

**Response:**

```json
{
  "message": "Athlete stats updated successfully",
  "athlete": {
    "id": "abc123",
    "name": "John Doe",
    "wins": 16,
    "losses": 2,
    "followers": 52000
  }
}
```

#### 3. Revalidate All Caches

Trigger a comprehensive cache invalidation for all athlete-related data, rankings, and pages.

**Endpoint:** `POST /api/bot/revalidate-all`

**Rate Limit:** 10 requests per minute

**Example:**

```bash
curl -X POST "https://your-domain.com/api/bot/revalidate-all" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"
```

**Response:**

```json
{
  "message": "All caches revalidated successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Responses

**401 Unauthorized** - Invalid or missing bearer token

```json
{
  "error": "Unauthorized. Valid Bearer token required."
}
```

**429 Rate Limit Exceeded**

```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

**404 Not Found** - Athlete not found

```json
{
  "error": "Athlete not found"
}
```

**400 Bad Request** - Validation error

```json
{
  "error": "Validation error",
  "details": [
    {
      "message": "At least one stat field must be provided"
    }
  ]
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

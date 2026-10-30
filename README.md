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

The application includes a bearer-token-protected bot API for automated athlete and event management. All endpoints require a valid bearer token in the `Authorization` header. Every write endpoint invalidates the same caches as the matching dashboard action, so changes show on the live site without a dashboard save.

| Method | Path | Purpose | Rate limit |
| --- | --- | --- | --- |
| `GET` | `/api/bot/athletes?name={name}` | Search athletes by name | 60/min |
| `POST` | `/api/bot/athletes` | Create an athlete (always unranked) | 20/min |
| `PATCH` | `/api/bot/athletes/{id}/stats` | Update stats and profile fields | 30/min |
| `DELETE` | `/api/bot/athletes/{id}` | Delete an athlete (`?force=true` if ranked) | 10/min |
| `GET` | `/api/bot/rankings?division=…` or `?p4p=…` | Read a rankings board | 60/min |
| `PUT` | `/api/bot/rankings/division` | Replace a division board | 10/min |
| `PUT` | `/api/bot/rankings/p4p` | Replace a pound-for-pound board | 10/min |
| `POST` | `/api/bot/revalidate-all` | Revalidate every athlete cache | 10/min |
| `POST` | `/api/bot/events` | Create an event | 20/min |
| `GET` | `/api/bot/events` | List or search events | 60/min |
| `PATCH` | `/api/bot/events/{id}` | Update an event | 30/min |
| `DELETE` | `/api/bot/events/{id}` | Delete an event | 10/min |

> **Note:** The API uses an in-memory rate limiter which is safe for serverless deployments. Each serverless function instance maintains its own rate limit state, providing per-instance protection. For distributed rate limiting across all instances, consider using Redis or a similar external store.

### Authentication

Include the bearer token in the `Authorization` header:

```
Authorization: Bearer YOUR_BOT_API_SECRET
```

### Endpoints

#### 1. Athlete Lookup by Name

Search for athletes by name (case-insensitive partial match).

**Endpoint:** `GET /api/bot/athletes?name={name}`

**Parameters:**
- `name` (query parameter) - The athlete name or partial name to search for

**Rate Limit:** 60 requests per minute

**Example:**

```bash
curl -X GET "https://your-domain.com/api/bot/athletes?name=John%20Doe" \
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

#### 2. Create Athlete

Create a new athlete. New athletes always start with `rank` 0 and `poundForPoundRank` 0; place them on a board afterwards with the rankings endpoints below. Uses the same cache invalidation as the dashboard's create action.

**Endpoint:** `POST /api/bot/athletes`

**Required Fields:**
- `name` (string, min 2 chars, trimmed) - Must not match an existing athlete's name (case-insensitive)
- `gender` (string: `MALE` or `FEMALE`)
- `weightDivision` (string) - One of the divisions listed under [Update Athlete](#3-update-athlete). Must match `gender`: `MALE` uses `Men's …` and `FEMALE` uses `Women's …`.
- `country` (string, min 2 chars)
- `age` (number, positive integer)

**Optional Fields:**
- `wins`, `losses`, `draws`, `winsByKo`, `winsBySubmission`, `followers` (number, non-negative integer) - Default `0`. `winsByKo + winsBySubmission` cannot exceed `wins`.
- `retired` (boolean) - Default `false`
- `imageUrl` (string, valid URL or empty string) - Default `""`

Sending `rank` or `poundForPoundRank` (with any value) returns **400** and creates nothing. Set ranks with `PUT /api/bot/rankings/division` or `PUT /api/bot/rankings/p4p`.

If an athlete with the same name already exists (case-insensitive), the response is **409** and includes that athlete's `id` and `name`:

```json
{
  "error": "An athlete with this name already exists",
  "id": "abc123",
  "name": "John Doe"
}
```

**Rate Limit:** 20 requests per minute

**Example:**

```bash
curl -X POST "https://your-domain.com/api/bot/athletes" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"gender\":\"FEMALE\",\"weightDivision\":\"Women's Strawweight\",\"country\":\"US\",\"age\":27,\"wins\":10,\"losses\":1,\"winsByKo\":3,\"winsBySubmission\":4,\"followers\":25000}"
```

**Response:** `201 Created`

```json
{
  "message": "Athlete created successfully",
  "athlete": {
    "id": "def456",
    "name": "Jane Doe",
    "gender": "FEMALE",
    "age": 27,
    "weightDivision": "Women's Strawweight",
    "country": "US",
    "imageUrl": "",
    "wins": 10,
    "losses": 1,
    "draws": 0,
    "winsByKo": 3,
    "winsBySubmission": 4,
    "followers": 25000,
    "rank": 0,
    "poundForPoundRank": 0,
    "retired": false,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

#### 3. Update Athlete

Update athlete statistics and profile fields. Division rank and pound-for-pound rank are not accepted here; use the bulk rankings endpoints below. Retirement still clears both ranks. Uses the same cache invalidation strategy as the dashboard.

**Endpoint:** `PATCH /api/bot/athletes/{id}/stats`

**Parameters:**
- `id` (path parameter) - The athlete ID

**Updatable Fields:** (at least one field required)

**Statistics:**
- `wins` (number, non-negative integer) - Total wins
- `losses` (number, non-negative integer) - Total losses
- `draws` (number, non-negative integer) - Total draws
- `winsByKo` (number, non-negative integer) - Wins by knockout
- `winsBySubmission` (number, non-negative integer) - Wins by submission
- `followers` (number, non-negative integer) - Social media followers

**Profile:**
- `name` (string, min 2 chars, trimmed) - Returns **409** with the other athlete's `id` if another athlete already has this name (case-insensitive)
- `gender` (string: `MALE` or `FEMALE`)
- `country` (string, min 2 chars)
- `imageUrl` (string, valid URL, or `""` to clear)

**Other:**
- `age` (number, positive integer) - Athlete's age
- `weightDivision` (string) - Must be one of: `Men's Heavyweight`, `Men's Light Heavyweight`, `Men's Middleweight`, `Men's Welterweight`, `Men's Lightweight`, `Men's Featherweight`, `Men's Bantamweight`, `Men's Flyweight`, `Women's Bantamweight`, `Women's Flyweight`, `Women's Strawweight`
- `retired` (boolean) - Retirement status (automatically clears division rank and pound-for-pound rank when set to `true`)

When `gender` or `weightDivision` is sent, the resulting pair must match (`MALE` with `Men's …`, `FEMALE` with `Women's …`), or the response is **400**. To move an athlete across genders, send both fields together. Changing `gender` while the athlete holds a pound-for-pound rank returns **409**; clear them from the board with `PUT /api/bot/rankings/p4p` first.

Sending `rank` or `poundForPoundRank` returns **400** and does not update the athlete. Set those with `PUT /api/bot/rankings/division` or `PUT /api/bot/rankings/p4p`.

**Rate Limit:** 30 requests per minute

**Example:**

```bash
curl -X PATCH "https://your-domain.com/api/bot/athletes/abc123/stats" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "wins": 16,
    "losses": 2,
    "followers": 52000,
    "age": 29
  }'
```

**Response:**

```json
{
  "message": "Athlete updated successfully",
  "athlete": {
    "id": "abc123",
    "name": "John Doe",
    "wins": 16,
    "losses": 2,
    "followers": 52000,
    "age": 29
  }
}
```

The response `athlete` is the full updated record (truncated above).

#### 4. Delete Athlete

Delete an athlete. Uses the same cache invalidation as the dashboard's delete action.

**Endpoint:** `DELETE /api/bot/athletes/{id}`

**Parameters:**
- `id` (path parameter) - The athlete ID
- `force` (query parameter, optional) - Set to `true` to delete a ranked athlete

If the athlete is ranked (`rank > 0` or `poundForPoundRank > 0`) and `force=true` is not set, the response is **409** and nothing is deleted:

```json
{
  "error": "Athlete is ranked. Remove them from the rankings with PUT /api/bot/rankings/division or PUT /api/bot/rankings/p4p first, or pass ?force=true to delete anyway.",
  "id": "abc123",
  "name": "John Doe",
  "rank": 3,
  "poundForPoundRank": 0
}
```

Force-deleting a ranked athlete leaves a gap on that board. Resubmit the board with the rankings endpoints afterwards.

**Rate Limit:** 10 requests per minute

**Example:**

```bash
curl -X DELETE "https://your-domain.com/api/bot/athletes/abc123?force=true" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"
```

**Response:**

```json
{
  "message": "Athlete deleted successfully",
  "athlete": {
    "id": "abc123",
    "name": "John Doe",
    "weightDivision": "Men's Lightweight",
    "rank": 3,
    "poundForPoundRank": 0
  }
}
```

#### 5. Get Rankings

Read the current board directly from the database. Responses are uncached.

**Division:** `GET /api/bot/rankings?division={weightDivision}`

**Pound-for-pound:** `GET /api/bot/rankings?p4p={gender}`

**Parameters:**
- `division` - Full division name, such as `Men's Lightweight` or `Women's Strawweight`. Do not combine with `p4p`.
- `p4p` - `MALE` or `FEMALE`. Do not combine with `division`.

Returns non-retired athletes who currently hold a rank greater than 0: `id`, `name`, and `rank` or `poundForPoundRank`.

**Rate Limit:** 60 requests per minute

**Example:**

```bash
curl -X GET "https://your-domain.com/api/bot/rankings?division=Men%27s%20Lightweight" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"
```

**Response:**

```json
{
  "weightDivision": "Men's Lightweight",
  "count": 2,
  "rankings": [
    { "id": "abc123", "name": "Jane Doe", "rank": 1 },
    { "id": "def456", "name": "John Doe", "rank": 2 }
  ]
}
```

#### 6. Replace Division Rankings

Replace the full division board in one transaction. Athletes in that division who are omitted are set to rank `0`.

**Endpoint:** `PUT /api/bot/rankings/division`

**Body:**
- `weightDivision` (string) - Full division name
- `rankings` (array) - `{ "athleteId": string, "rank": number }`. This is the complete board, not a partial patch.
- `dryRun` (boolean, optional) - When `true`, return the before/after diff and write nothing
- `vacantChampion` (boolean, optional) - When `true`, ranks start at 2 because there is no champion

**Rules:**
- Ranks are unique and contiguous, starting at 1 (or 2 when `vacantChampion` is true), and no rank is above 16. Rank 1 is champion. Ranks 2–16 are UFC #1–#15. A vacant title can list at most 15 fighters (ranks 2–16).
- `athleteId` values are unique.
- Every athlete exists, fights in `weightDivision`, and is not retired.
- An empty `rankings` array clears the division.

**Rate Limit:** 10 requests per minute

**Example:**

```bash
curl -X PUT "https://your-domain.com/api/bot/rankings/division" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"weightDivision\":\"Men's Lightweight\",\"dryRun\":true,\"rankings\":[{\"athleteId\":\"abc123\",\"rank\":1},{\"athleteId\":\"def456\",\"rank\":2}]}"
```

**Dry-run response:**

```json
{
  "dryRun": true,
  "weightDivision": "Men's Lightweight",
  "vacantChampion": false,
  "changes": [
    { "athleteId": "abc123", "name": "Jane Doe", "before": 2, "after": 1 },
    { "athleteId": "ghi789", "name": "Alex Smith", "before": 1, "after": 0 }
  ]
}
```

Omit `dryRun` (or set it to `false`) to apply the diff. The response includes `updated` and the same `changes` array. Cache invalidation runs only after a write.

#### 7. Replace Pound-for-Pound Rankings

Replace the full pound-for-pound board for one gender. Other athletes of that gender are set to `poundForPoundRank` 0.

**Endpoint:** `PUT /api/bot/rankings/p4p`

**Body:**
- `gender` - `MALE` or `FEMALE`
- `rankings` - `{ "athleteId": string, "rank": number }` for the complete board
- `dryRun` (boolean, optional) - When `true`, return the diff and write nothing

**Rules:**
- Ranks are unique and contiguous from 1 through at most 15.
- Every athlete exists, matches `gender`, and is not retired.

**Rate Limit:** 10 requests per minute

**Example:**

```bash
curl -X PUT "https://your-domain.com/api/bot/rankings/p4p" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "MALE",
    "rankings": [
      { "athleteId": "abc123", "rank": 1 },
      { "athleteId": "def456", "rank": 2 }
    ]
  }'
```

#### 8. Revalidate All Caches

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

**404 Not Found** - Athlete or event not found

```json
{
  "error": "Athlete not found"
}
```

**409 Conflict** - Duplicate athlete name, ranked athlete delete without `?force=true`, or gender change while holding a pound-for-pound rank. The body includes `error` and, where relevant, the conflicting athlete's `id`.

```json
{
  "error": "An athlete with this name already exists",
  "id": "abc123",
  "name": "John Doe"
}
```

**500 Internal Server Error** - Unexpected server or database error, including a request body that is not valid JSON

```json
{
  "error": "Internal server error"
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

---

## Bot API - Events

The bot API also provides endpoints for managing events.

### Endpoints

#### 1. Create Event

Create a new event.

**Endpoint:** `POST /api/bot/events`

**Required Fields:**
- `name` (string, min 2 chars) - Event name
- `date` (string, ISO 8601 format) - Event date
- `venue` (string, min 2 chars) - Venue name
- `location` (string, min 2 chars) - Location/city
- `mainEvent` (string, min 2 chars) - Main event matchup

**Optional Fields:**
- `coMainEvent` (string) - Co-main event matchup
- `imageUrl` (string, valid URL) - Event poster/image URL
- `status` (string: `UPCOMING`, `COMPLETED`, `CANCELLED`) - Defaults to `UPCOMING`

**Rate Limit:** 20 requests per minute

**Example:**

```bash
curl -X POST "https://your-domain.com/api/bot/events" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "UFC 300",
    "date": "2024-04-13T02:00:00Z",
    "venue": "T-Mobile Arena",
    "location": "Las Vegas, Nevada",
    "mainEvent": "Alex Pereira vs Jamahal Hill",
    "coMainEvent": "Zhang Weili vs Yan Xiaonan",
    "imageUrl": "https://example.com/ufc300.jpg",
    "status": "UPCOMING"
  }'
```

**Response:**

```json
{
  "message": "Event created successfully",
  "event": {
    "id": "xyz789",
    "name": "UFC 300",
    "date": "2024-04-13T02:00:00.000Z",
    "venue": "T-Mobile Arena",
    "location": "Las Vegas, Nevada",
    "mainEvent": "Alex Pereira vs Jamahal Hill",
    "coMainEvent": "Zhang Weili vs Yan Xiaonan",
    "imageUrl": "https://example.com/ufc300.jpg",
    "status": "UPCOMING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. List/Search Events

Search for events by name or status (uncached for bot use).

**Endpoint:** `GET /api/bot/events`

**Query Parameters:**
- `name` (optional) - Search by event name (case-insensitive partial match)
- `status` (optional) - Filter by status: `UPCOMING`, `COMPLETED`, or `CANCELLED`

**Rate Limit:** 60 requests per minute

**Examples:**

```bash
# List all events (up to 50 most recent)
curl -X GET "https://your-domain.com/api/bot/events" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"

# Search by name
curl -X GET "https://your-domain.com/api/bot/events?name=UFC%20300" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"

# Filter by status
curl -X GET "https://your-domain.com/api/bot/events?status=UPCOMING" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"

# Combine filters
curl -X GET "https://your-domain.com/api/bot/events?name=UFC&status=UPCOMING" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"
```

**Response:**

```json
{
  "count": 2,
  "events": [
    {
      "id": "xyz789",
      "name": "UFC 300",
      "date": "2024-04-13T02:00:00.000Z",
      "venue": "T-Mobile Arena",
      "location": "Las Vegas, Nevada",
      "mainEvent": "Alex Pereira vs Jamahal Hill",
      "coMainEvent": "Zhang Weili vs Yan Xiaonan",
      "imageUrl": "https://example.com/ufc300.jpg",
      "status": "UPCOMING",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 3. Update Event

Update an event's status and other fields.

**Endpoint:** `PATCH /api/bot/events/{id}`

**Parameters:**
- `id` (path parameter) - The event ID

**Updatable Fields:** (at least one field required)
- `name` (string, min 2 chars) - Event name
- `date` (string, ISO 8601 format) - Event date
- `venue` (string, min 2 chars) - Venue name
- `location` (string, min 2 chars) - Location/city
- `mainEvent` (string, min 2 chars) - Main event matchup
- `coMainEvent` (string) - Co-main event matchup
- `imageUrl` (string, valid URL or empty string to clear) - Event poster/image URL
- `status` (string: `UPCOMING`, `COMPLETED`, `CANCELLED`) - Event status

**Rate Limit:** 30 requests per minute

**Example:**

```bash
curl -X PATCH "https://your-domain.com/api/bot/events/xyz789" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

**Response:**

```json
{
  "message": "Event updated successfully",
  "event": {
    "id": "xyz789",
    "name": "UFC 300",
    "date": "2024-04-13T02:00:00.000Z",
    "venue": "T-Mobile Arena",
    "location": "Las Vegas, Nevada",
    "mainEvent": "Alex Pereira vs Jamahal Hill",
    "coMainEvent": "Zhang Weili vs Yan Xiaonan",
    "imageUrl": "https://example.com/ufc300.jpg",
    "status": "COMPLETED",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:45:00.000Z"
  }
}
```

#### 4. Delete Event

Delete an event. Uses the same cache invalidation as the dashboard's delete action.

**Endpoint:** `DELETE /api/bot/events/{id}`

**Parameters:**
- `id` (path parameter) - The event ID

Returns **404** with `{ "error": "Event not found" }` if no event has that ID.

**Rate Limit:** 10 requests per minute

**Example:**

```bash
curl -X DELETE "https://your-domain.com/api/bot/events/xyz789" \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET"
```

**Response:**

```json
{
  "message": "Event deleted successfully",
  "event": {
    "id": "xyz789",
    "name": "UFC 300",
    "date": "2024-04-13T02:00:00.000Z",
    "status": "COMPLETED"
  }
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

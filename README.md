# Rugby Team API

RESTful API for managing Rugby team data, including players, teams, finances, and statistics.

## Tech Stack

- **TypeScript** - Type-safe development
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database and authentication
- **Node.js** - Runtime environment

## Features

- ✅ Full CRUD operations for all entities
- ✅ Team management
- ✅ Player roster tracking
- ✅ Payment and finance management
- ✅ Season statistics
- ✅ Player affiliations
- ✅ Admin role management
- ✅ CORS configured for your production domain

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Setup

1. **Clone the repository** (or use this directory)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration SQL in Supabase SQL Editor:
     ```bash
     # Copy content from supabase/migrations/001_initial_schema.sql
     # and execute in Supabase SQL Editor
     ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   PORT=3000
   NODE_ENV=development
   
   # Production URLs (for CORS and API documentation)
   PRODUCTION_URL=https://your-domain.com
   PRODUCTION_URL_WWW=https://www.your-domain.com
   API_URL=https://api.your-domain.com
   ```
   
   **Note:** Replace the production URLs with your actual domain names.

## Running the Application

### Development mode with hot reload:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
```

### Run production build:
```bash
npm start
```

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `GET /api/players/team/:teamId` - Get players by team
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Player Numbers
- `GET /api/player-numbers` - Get all player numbers
- `GET /api/player-numbers/player/:playerId` - Get number by player ID
- `POST /api/player-numbers` - Assign player number
- `PUT /api/player-numbers/:id` - Update player number
- `DELETE /api/player-numbers/:id` - Delete player number

### Affiliations
- `GET /api/affiliations` - Get all affiliations
- `GET /api/affiliations/player/:playerId` - Get affiliation by player ID
- `POST /api/affiliations` - Create affiliation
- `PUT /api/affiliations/:id` - Update affiliation
- `DELETE /api/affiliations/:id` - Delete affiliation

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/player/:playerId` - Get payment by player ID
- `GET /api/payments/debt` - Get players with debt
- `POST /api/payments` - Create payment record
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Admins
- `GET /api/admins` - Get all admins
- `GET /api/admins/player/:playerId` - Get admin by player ID
- `POST /api/admins` - Create admin
- `PUT /api/admins/:id` - Update admin role
- `DELETE /api/admins/:id` - Remove admin

### Seasons
- `GET /api/seasons` - Get all seasons
- `GET /api/seasons/:id` - Get season by ID
- `POST /api/seasons` - Create season
- `PUT /api/seasons/:id` - Update season
- `DELETE /api/seasons/:id` - Delete season

### Stats
- `GET /api/stats` - Get all stats
- `GET /api/stats/:id` - Get stats by ID
- `GET /api/stats/player/:playerId` - Get stats by player
- `GET /api/stats/season/:seasonId` - Get stats by season
- `POST /api/stats` - Create stats record
- `PUT /api/stats/:id` - Update stats
- `DELETE /api/stats/:id` - Delete stats

## Example Usage

### Create a Team
```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Team",
    "region": "Ciudad de México"
  }'
```

### Create a Player
```bash
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "uuid-from-team-creation",
    "player_name": "Juan Pérez",
    "date_of_birth": "1995-05-15",
    "curp": "PEXJ950515HDFRNN01",
    "email": "juan@example.com",
    "phone_number": "+525512345678",
    "password": "hashed_password",
    "federation_id": 12345,
    "category": "Senior"
  }'
```

## Project Structure

```
teamAPI/
├── src/
│   ├── config/
│   │   └── supabase.ts         # Supabase client
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Express middleware
│   ├── routes/                 # Route definitions
│   ├── types/                  # TypeScript types
│   └── index.ts                # App entry point
├── supabase/
│   └── migrations/             # Database migrations
└── package.json
```

## Database Schema

The database includes the following tables:
- `team` - Team information
- `player` - Player details
- `player_number` - Jersey numbers
- `affiliations` - Federation/association status
- `payments` - Financial records
- `admin` - Admin roles
- `season` - Season information
- `stats` - Player statistics

See `supabase/migrations/001_initial_schema.sql` for full schema details.

## Authentication

The API includes authentication middleware using Supabase Auth. To protect routes, import and use the `authMiddleware`:

```typescript
import { authMiddleware } from './middleware/auth.middleware';

router.post('/protected-route', authMiddleware, controller);
```

## License

ISC

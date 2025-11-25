# 🔐 Authentication Implementation

## Overview

The Rugby Team API uses **Supabase Auth** for secure user authentication. This document explains how authentication works and how to use it.

## 🎯 Features

- ✅ **Email/Password Authentication** via Supabase
- ✅ **JWT Token-based** authorization
- ✅ **User Registration** with automatic player record creation
- ✅ **Password Reset** functionality
- ✅ **Role-based Access Control** (Admin middleware)
- ✅ **Protected Routes** for sensitive operations
- ✅ **Test UI** for easy testing

## 🧪 Test the Auth System

### Interactive UI
Visit **http://localhost:3000/auth-test.html** after starting the server.

The test UI allows you to:
- Register new users
- Login with existing accounts
- Test authenticated API endpoints
- View current user info
- Logout

### Manual Testing with cURL

#### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@team.com",
    "password": "securepass123",
    "player_name": "Juan Pérez",
    "date_of_birth": "1995-05-15",
    "curp": "PEXJ950515HDFRNN01",
    "team_id": "YOUR_TEAM_UUID",
    "federation_id": 12345,
    "phone_number": "+525512345678",
    "category": "Senior"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@team.com",
    "password": "securepass123"
  }'
```

Response includes a `token` - save this for authenticated requests!

#### 3. Access Protected Endpoint
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login | No |
| `/api/auth/logout` | POST | Logout | No |
| `/api/auth/me` | GET | Get current user | Yes |
| `/api/auth/forgot-password` | POST | Request password reset | No |

## 🔒 Protected Routes

### Public Routes (No Auth Required)
- `GET /api/teams` - View all teams
- `GET /api/players` - View all players
- `GET /api/seasons` - View seasons
- `GET /api/stats` - View statistics

### Protected Routes (Auth Required)
Add authentication middleware to any route:

```typescript
router.post('/endpoint', authMiddleware, controller.action);
```

### Admin-Only Routes
Require both authentication AND admin role:

```typescript
router.delete('/endpoint', authMiddleware, adminMiddleware, controller.action);
```

## 🗄️ Database Integration

### Auth User Link
Players are linked to Supabase auth users via `auth_user_id`:

```sql
ALTER TABLE player ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
```

### User Flow
1. User registers → Supabase creates auth user
2. API creates player record with `auth_user_id`
3. User logs in → receives JWT token
4. Token used for authenticated API calls

## 🛡️ Security Features

### JWT Validation
All authenticated routes verify tokens with Supabase:

```typescript
const { data: { user }, error } = await supabase.auth.getUser(token);
```

### Admin Check
Admin routes verify user has admin role in database:

```typescript
const { data } = await supabase
  .from('admin')
  .select('*')
  .eq('player_id', user.id)
  .single();
```

### Password Security
- Passwords hashed by Supabase (bcrypt)
- Never stored in plain text
- Minimum 6 characters enforced

## 💻 Frontend Integration

### Using the Token

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
const token = data.token;

// Store token
localStorage.setItem('authToken', token);

// Use in subsequent requests
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### React Example

```jsx
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { data } = await res.json();
    setToken(data.token);
    localStorage.setItem('authToken', data.token);
  };
  
  return { token, login };
};
```

## 🔑 Environment Setup

Required in `.env`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

Get these from: Supabase Dashboard → Project Settings → API

## 📝 Database Migration

Run this SQL in Supabase to add auth support:

```sql
-- See: supabase/migrations/002_add_auth_integration.sql
ALTER TABLE player ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
CREATE INDEX idx_player_auth_user ON player(auth_user_id);
```

## 🎨 Customization

### Custom Email Templates
Configure in Supabase Dashboard → Authentication → Email Templates

### Password Requirements
Modify in Supabase Dashboard → Authentication → Policies

### OAuth Providers
Enable Google, GitHub, etc. in Supabase Dashboard → Authentication → Providers

## ❓ Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify all SUPABASE_* variables are set
- Restart server after editing `.env`

### "Invalid or expired token"
- Token might be expired (check Supabase settings)
- User might have been deleted
- Clear token and re-login

### Registration fails
- Check team_id exists in database
- Verify email is not already registered
- Check Supabase email confirmation settings

## 🔗 Related Files

- Auth Controller: [`src/controllers/auth.controller.ts`](src/controllers/auth.controller.ts)
- Auth Middleware: [`src/middleware/auth.middleware.ts`](src/middleware/auth.middleware.ts)
- Routes: [`src/routes/index.ts`](src/routes/index.ts)
- Test UI: [`public/auth-test.html`](public/auth-test.html)
- Migration: [`supabase/migrations/002_add_auth_integration.sql`](supabase/migrations/002_add_auth_integration.sql)

## ✨ Next Steps

1. Set up Supabase project
2. Run database migrations
3. Configure `.env` file
4. Test with UI at `/auth-test.html`
5. Implement in your frontend
6. Deploy to production!

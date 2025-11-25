# Testing - Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure test environment
cp .env.test.example .env.test
# Edit .env.test with your test Supabase credentials

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📋 Available Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:integration` | Run only integration tests |
| `npm run test:unit` | Run only unit tests |

## 📁 Test Files

- **Integration Tests**: `tests/integration/`
  - [`teams.test.ts`](tests/integration/teams.test.ts) - Team CRUD tests
  - [`auth.test.ts`](tests/integration/auth.test.ts) - Authentication tests
  - [`players-stats.test.ts`](tests/integration/players-stats.test.ts) - Player & stats tests

- **Test Helpers**: [`tests/helpers/testHelpers.ts`](tests/helpers/testHelpers.ts)

## 🧰 Manual Testing Tools

### 1. Web Test Interface
```
http://localhost:3000/auth-test.html
```
Interactive UI for testing authentication and endpoints.

### 2. Swagger Documentation
```
http://localhost:3000/api-docs
```
Complete API documentation with "Try it out" functionality.

### 3. Postman Collection
Import [`Rugby_Team_API.postman_collection.json`](Rugby_Team_API.postman_collection.json) into Postman or Insomnia.

## 📚 Full Documentation

For complete testing guide, see the Testing Guide artifact.

## 🐛 Common Issues

**Tests won't run?**
- Check `.env.test` has correct Supabase credentials
- Ensure test database schema is up to date
- Run `npm install` to install dependencies

**Port conflict?**
- Change `PORT` in `.env.test` to different port (e.g., 3001)

**Auth tests fail?**
- Verify `SUPABASE_SERVICE_KEY` in `.env.test`
- Ensure Supabase Auth is enabled in test project

# Docker Deployment Guide

## Quick Start

### Using Docker Compose (Recommended)

1. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

2. **Start the application:**
   ```bash
   docker compose up --build -d
   ```

3. **View logs:**
   ```bash
   docker compose logs -f
   ```

4. **Stop production:**
   ```bash
   docker compose down
   ```

---

## Development with Docker

For development with hot-reload:

```bash
# Start development container
docker-compose -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build
```

---

## Production Deployment

### Building the Image

```bash
# Build production image
docker build -t rugby-team-api:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name rugby-api \
  rugby-team-api:latest
```

### Multi-Stage Build Benefits

The Dockerfile uses a multi-stage build for:
- ✅ Smaller final image size (~150MB vs ~1GB)
- ✅ Only production dependencies included
- ✅ Built TypeScript artifacts
- ✅ Non-root user for security
- ✅ Health checks configured

---

## Environment Variables

Ensure your `.env` file contains:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3000
NODE_ENV=production
PRODUCTION_URL=https://your-domain.com
PRODUCTION_URL_WWW=https://www.your-domain.com
API_URL=https://api.your-domain.com
```

---

## Health Checks

The container includes a health check that verifies:
- Container is running
- Application is responding on port 3000
- Returns 200 status code

Check health status:
```bash
docker ps
docker inspect --format='{{json .State.Health}}' rugby-api
```

---

## Cloud Deployment

### Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Add environment variables in Railway dashboard

### Render

1. Connect your GitHub repository
2. Select "Docker" as environment
3. Add environment variables
4. Deploy

### Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/rugby-api

# Deploy to Cloud Run
gcloud run deploy rugby-api \
  --image gcr.io/PROJECT_ID/rugby-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### AWS ECS

1. Push to ECR:
   ```bash
   aws ecr create-repository --repository-name rugby-api
   docker tag rugby-team-api:latest AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/rugby-api:latest
   docker push AWS_ACCOUNT.dkr.ecr.REGION.amazonaws.com/rugby-api:latest
   ```

2. Create ECS task definition and service

---

## Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start services |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop services |
| `docker-compose logs -f` | View logs |
| `docker-compose ps` | List running services |
| `docker-compose restart` | Restart services |
| `docker-compose build` | Rebuild images |

---

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs api
```

### Build fails

Clear cache and rebuild:
```bash
docker-compose build --no-cache
```

### Port already in use

Change port in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Environment variables not working

Verify `.env` file exists and is loaded:
```bash
docker-compose config
```

---

## Production Best Practices

1. **Use secrets management** for sensitive credentials
2. **Enable HTTPS** with reverse proxy (nginx/Caddy)
3. **Set up monitoring** (Prometheus, Grafana)
4. **Configure logging** (centralized logging service)
5. **Implement CI/CD** for automated deployments
6. **Use container orchestration** (Kubernetes) for scaling

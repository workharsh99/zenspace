# 🧘 ZenSpace - Stress Relief & Mental Wellness App

A complete **DevOps-based microservices** project for stress relief and mental wellness, built with Spring Boot, React, MongoDB, Docker, and GitHub Actions CI/CD.

---

## 🏗️ Architecture Overview

```
Developer Push Code
        ↓
GitHub Trigger Event
        ↓
GitHub Actions / Jenkins Pipeline
        ↓
Maven Build (3 microservices)
        ↓
Docker Image Build (Dockerfile)
        ↓
Docker Compose Deployment
        ↓
Application Running 🚀
```

---

## 📦 Project Structure

```
stress-relief-project/
├── frontend/                    # React.js + Tailwind CSS
├── user-service/                # Spring Boot - Port 8081
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── activity-service/            # Spring Boot - Port 8082
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── session-service/             # Spring Boot - Port 8083
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── nginx/
│   └── nginx.conf               # API Gateway + Frontend serving
├── mongo-init/
│   └── init.js                  # MongoDB initialization
├── docker-compose.yml           # Orchestrates all containers
├── .env                         # Environment variables
├── Jenkinsfile                  # Jenkins CI/CD pipeline
└── .github/workflows/main.yml   # GitHub Actions CI/CD
```

---

## 🐳 Docker Images

| # | Image | Source | Purpose |
|---|-------|--------|---------|
| 1 | `wellness/user-service` | **Custom Dockerfile** | User auth & profiles |
| 2 | `wellness/activity-service` | **Custom Dockerfile** | Wellness activities |
| 3 | `wellness/session-service` | **Custom Dockerfile** | Session tracking |
| 4 | `mongo:7.0` | **DockerHub** | Database |
| 5 | `nginx:alpine` | **DockerHub** | API Gateway + Frontend |

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Docker Compose
- Java 21 (for local dev)
- Node.js 20 (for frontend dev)

### Run with Docker Compose

```bash
# Clone the repository
git clone <your-repo-url>
cd stress-relief-project

# Build frontend first
cd frontend
npm install
npm run build
cd ..

# Start all services
docker compose up -d --build

# Check status
docker compose ps
```

### Access the Application
- **Frontend**: http://localhost:80
- **User Service**: http://localhost:8081
- **Activity Service**: http://localhost:8082
- **Session Service**: http://localhost:8083

---

## 🔌 API Endpoints

### User Service (Port 8081)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login & get JWT |
| GET | `/api/users/{id}` | Get user profile |
| PUT | `/api/users/{id}/profile` | Update profile |
| GET | `/api/users/health` | Health check |

### Activity Service (Port 8082)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get all activities |
| GET | `/api/activities/{id}` | Get activity by ID |
| GET | `/api/activities/category/{cat}` | Filter by category |
| GET | `/api/activities/search?keyword=` | Search activities |
| GET | `/api/activities/featured` | Featured activities |
| POST | `/api/activities` | Create activity |
| PUT | `/api/activities/{id}` | Update activity |
| DELETE | `/api/activities/{id}` | Delete activity |

### Session Service (Port 8083)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/start` | Start a session |
| PUT | `/api/sessions/{id}/complete` | Complete session |
| GET | `/api/sessions/user/{userId}` | Get user sessions |
| GET | `/api/sessions/stats/{userId}` | Wellness statistics |
| POST | `/api/sessions/favorites` | Add to favorites |
| DELETE | `/api/sessions/favorites/{actId}` | Remove favorite |
| GET | `/api/sessions/favorites/user/{userId}` | Get favorites |

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/main.yml`)
Triggers on push to `main`, `develop`, or `feature/**` branches:

1. **Maven Build** - Builds all 3 microservices in parallel
2. **Frontend Build** - Builds React app
3. **Docker Build** - Builds custom images + pulls DockerHub images
4. **Integration Test** - Runs docker-compose and health checks
5. **Deploy** - Pushes images to DockerHub (on main branch)

### Jenkins (`Jenkinsfile`)
Alternative pipeline with same stages, triggered via GitHub webhook.

---

## 🌿 Wellness Activities (Sample Data)

Auto-seeded on first startup:
- 🧘 Morning Mindfulness Meditation
- 💨 4-7-8 Breathing Technique
- 🌿 Gentle Morning Yoga Flow
- 🎵 Nature Sounds Relaxation
- ⭐ Daily Affirmations & Motivation
- 💨 Box Breathing for Focus
- 🧘 Body Scan Meditation
- 🌿 Stress Relief Yoga Nidra
- 🎵 Binaural Beats for Deep Focus
- ⭐ Gratitude Journaling Practice

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_ROOT_USER` | `admin` | MongoDB root username |
| `MONGO_ROOT_PASSWORD` | `wellness123` | MongoDB root password |
| `JWT_SECRET` | `WellnessApp...` | JWT signing secret |
| `JWT_EXPIRATION` | `86400000` | JWT expiry (24h in ms) |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Axios, React Router |
| Backend | Spring Boot 3.2, Java 21, Maven |
| Database | MongoDB 7.0 |
| Security | Spring Security, JWT (JJWT) |
| Container | Docker, Docker Compose |
| Gateway | Nginx |
| CI/CD | GitHub Actions, Jenkins |

---

## 📊 MongoDB Collections

- **`users`** - User accounts and profiles
- **`activities`** - Wellness activities catalog
- **`sessions`** - User wellness sessions
- **`favorites`** - Saved favorite activities

# 🛰️ GeoTrack - Fleet Management & Real-time Tracking

[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15-A42E2B?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-15--3.4-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Celery](https://img.shields.io/badge/Celery-5.3-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**GeoTrack** is a high-performance backend API designed for real-time fleet management and geographic tracking. Built with **Django 5** and **PostGIS**, it handles complex spatial queries, automated fleet simulation, and real-time weather integration with resilience at its core.

---

## 🏛️ System Architecture

The project follows a micro-service oriented containerized architecture:

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| **Backend API** | Django 5 + DRF | RESTful endpoints, business logic, and spatial API. |
| **Database** | PostgreSQL + PostGIS | Geo-spatial data storage and native spatial queries. |
| **Task Queue** | Celery + Redis | Asynchronous simulation and external API polling. |
| **Resilience** | PyBreaker | Circuit Breaker pattern for external weather API. |
| **Documentation** | DRF-Spectacular | OpenAPI 3.0 auto-generated documentation. |

---

## 🚀 Key Features

- **📍 Advanced Spatial Queries**: Native PostGIS integration for high-performance radius searches.
- **🔄 Automated Fleet Simulation**: Background tasks automatically simulate vehicle movement and status updates.
- **⛅ Real-time Weather Integration**: Automatic weather synchronization based on vehicle's current coordinates via Open-Meteo.
- **🛡️ Fault Tolerance**: Implements the **Circuit Breaker** pattern to ensure system stability during external API outages.
- **📊 Observability**: Structured logging system for detailed tracking of background task lifecycles.
- **📚 Interactive Documentation**: Full Swagger/OpenAPI interface for easy API testing.

---

## 🛠️ Quick Start

### 1. Environment Setup
Clone the repository and create your local environment file:
```bash
cp .env.example .env
```

### 2. Launch Infrastructure
Build and start all services using Docker Compose:
```bash
docker compose up --build -d
```

### 3. Initialize Database & Seed Data
Run migrations and populate the system with 20 real-world vehicles in Santa Catarina (SC), Brazil:
```bash
docker compose exec app python manage.py migrate
docker compose exec app python manage.py seed
```

### 4. Explore the API
The interactive documentation is available at:
👉 [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

---

## 📡 API Endpoints (Core)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cars/` | List all vehicles (supports `status` filtering). |
| `POST` | `/api/cars/` | Register a new vehicle in the fleet. |
| `GET` | `/api/cars/nearby/` | **Spatial Search**: Find vehicles within a radius (km). |
| `GET` | `/api/docs/` | Interactive Swagger UI. |

---

## 🧪 Testing the Simulation

To monitor the real-time simulation (movement + weather updates), watch the worker logs:
```bash
docker compose logs -f celery_worker
```

**Simulation rules:**
- Runs every `SIMULATION_INTERVAL_SECONDS` (default: 30s).
- Randomly moves vehicles (~1km radius).
- Updates weather data via Open-Meteo.
- Randomly rotates status to simulate mechanical issues.

---

## ⚙️ Environment Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `DEBUG` | `True` | Enable/Disable debug mode. |
| `SIMULATION_INTERVAL_SECONDS` | `30` | Interval between fleet update cycles. |
| `OPEN_METEO_TIMEOUT` | `5` | External API request timeout limit. |
| `POSTGRES_DB` | `geotrack` | Database name. |

---

## 📜 Technical Decisions & Trade-offs

- **Native Spatial Queries**: By using PostGIS's `Distance` and `D(km=...)`, we offload complex mathematical calculations to the database layer, ensuring sub-millisecond responses for proximity searches.
- **Circuit Breaker Strategy**: We chose `pybreaker` with a `fail_max=3` and `reset_timeout=60` to prevent "cascading failures" when external weather services are slow or down.
- **Database Scheduler**: Configured for Celery Beat to allow future dynamic task scheduling without code deployments.

---

## 🏁 Future Roadmap

- [ ] **Task Parallelization**: Implement per-vehicle sub-tasks for better worker scalability.
- [ ] **JWT Authentication**: Add secure access control for management endpoints.
- [ ] **WebSocket Integration**: Push real-time updates to the frontend instead of polling.

# Portfolio

A personal portfolio application built with Angular frontend and FastAPI backend.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 19, SCSS, TypeScript |
| Backend | FastAPI, Python 3.13 |
| Database | MySQL 8 |
| ORM | SQLModel (Pydantic + SQLAlchemy) |
| Migrations | Alembic |
| Package Management | UV (Python), npm (Node) |
| Containerization | Docker, Docker Compose |
| Task Runner | Just |

## Project Structure

```
.
├── backend/                    # FastAPI application
│   ├── src/app/
│   │   ├── main.py            # Application entry point
│   │   ├── config.py          # Settings (env vars)
│   │   ├── database.py        # DB connection
│   │   ├── models/            # SQLModel models
│   │   └── routers/           # API endpoints
│   ├── tests/
│   │   └── integration/       # Integration tests
│   ├── alembic/               # Database migrations
│   ├── Dockerfile             # Production image
│   └── Dockerfile.dev         # Development image
├── frontend/                   # Angular application
│   ├── src/app/               # Components, services, etc.
│   ├── proxy.conf.json        # Dev API proxy config
│   ├── nginx.conf             # Production nginx config
│   ├── Dockerfile             # Production image
│   └── Dockerfile.dev         # Development image
├── docker-compose.yml          # Production stack
├── docker-compose.dev.yml      # Development stack
└── justfile                    # Task runner commands
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- [Just](https://github.com/casey/just) command runner
- (Optional) Node.js 22+ and Python 3.13+ for local development without Docker

### Development

Start the full stack with live reload:

```bash
just dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| MySQL | localhost:3306 |

Live reload is enabled for both frontend and backend. Edit files and changes will be reflected automatically.

### Just Commands

Run `just` to see all available commands. Common ones:

| Command | Description |
|---------|-------------|
| `just dev` | Start dev stack with live reload |
| `just down` | Stop containers |
| `just logs` | Tail all logs |
| `just migrate` | Run database migrations |
| `just migration "description"` | Create new migration |
| `just test` | Run backend tests |
| `just lint` | Run ruff linter |
| `just format` | Auto-format code |
| `just frontend-test` | Run Angular tests |
| `just ng generate component foo` | Run Angular CLI |
| `just db-shell` | Open MySQL shell |
| `just clean` | Remove containers and volumes |

## Backend Development

### Running Locally (without Docker)

```bash
cd backend
cp .env.example .env          # Configure database URL
uv sync                       # Install dependencies
uv run uvicorn src.app.main:app --reload
```

### Common Commands

With Docker (recommended):

```bash
just test                           # Run tests
just test --cov=src                 # Run tests with coverage
just migration "description"        # Create new migration
just migrate                        # Apply migrations
just rollback                       # Rollback one migration
```

Without Docker:

```bash
uv run pytest
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
```

### Adding a New Model

1. Create model in `backend/src/app/models/`:

```python
from sqlmodel import SQLModel, Field

class Project(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
```

2. Import in `backend/src/app/models/__init__.py`
3. Generate migration: `just migration "add project"`
4. Apply: `just migrate`

### Adding a New Router

1. Create router in `backend/src/app/routers/`:

```python
from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.app.database import get_session

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/")
def list_projects(session: Session = Depends(get_session)):
    # ...
```

2. Register in `backend/src/app/main.py`:

```python
from src.app.routers import projects
app.include_router(projects.router)
```

## Frontend Development

### Running Locally (without Docker)

```bash
cd frontend
npm install
npm start
```

### Common Commands

With Docker (recommended):

```bash
just frontend-test                              # Run tests
just ng generate component components/my-comp   # Generate component
```

Without Docker:

```bash
npm start           # Development server
npm run build       # Build for production
npm test            # Run tests
```

### API Calls

In development, API calls to `/api/*` are proxied to the backend (see `proxy.conf.json`).

```typescript
// Example service
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  getProjects() {
    return this.http.get('/api/projects');
  }
}
```

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql+pymysql://portfolio:portfolio@db:3306/portfolio` |
| `DEBUG` | Enable debug mode | `false` |

### Docker Compose

| Variable | Description | Default |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `rootpassword` |
| `MYSQL_DATABASE` | Database name | `portfolio` |
| `MYSQL_USER` | Database user | `portfolio` |
| `MYSQL_PASSWORD` | Database password | `portfolio` |

## Testing

```bash
just test            # Backend (pytest)
just frontend-test   # Frontend (Karma/Jasmine)
```

## Architecture Decisions

- **SQLModel over SQLAlchemy**: Single model definition serves as both database schema and Pydantic validation, reducing boilerplate
- **UV over pip**: Faster dependency resolution and better lockfile support
- **Alembic for migrations**: Industry standard, works well with SQLModel
- **nginx in production**: Serves static Angular files and proxies API requests
- **Docker Compose**: Consistent environments for development and production

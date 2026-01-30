# Portfolio Project Justfile
# Run `just` or `just --list` to see available recipes

# Compose file for development
compose := "docker compose -f docker-compose.dev.yml"

# Default recipe - show available commands
default:
    @just --list

# ─────────────────────────────────────────────────────────────────────────────
# Docker Compose
# ─────────────────────────────────────────────────────────────────────────────

# Start development stack with build
dev:
    {{ compose }} up --build

# Start development stack in background
dev-detach:
    {{ compose }} up --build -d

# Stop and remove containers
down:
    {{ compose }} down

# Build all images
build:
    {{ compose }} build

# Restart all services
restart:
    {{ compose }} restart

# Tail logs from all services
logs:
    {{ compose }} logs -f

# Tail backend logs only
logs-backend:
    {{ compose }} logs -f backend

# Tail frontend logs only
logs-frontend:
    {{ compose }} logs -f frontend

# Tail database logs only
logs-db:
    {{ compose }} logs -f db

# Show running containers
ps:
    {{ compose }} ps

# Stop containers and remove volumes (fresh start)
clean:
    {{ compose }} down -v

# ─────────────────────────────────────────────────────────────────────────────
# Database / Alembic
# ─────────────────────────────────────────────────────────────────────────────

# Run alembic migrations (upgrade to head)
migrate:
    {{ compose }} exec backend uv run alembic upgrade head

# Create new migration with autogenerate
migration name:
    {{ compose }} exec backend uv run alembic revision --autogenerate -m "{{ name }}"

# Rollback last migration
rollback:
    {{ compose }} exec backend uv run alembic downgrade -1

# Show migration history
migration-history:
    {{ compose }} exec backend uv run alembic history

# Show current migration
migration-current:
    {{ compose }} exec backend uv run alembic current

# Open MySQL shell
db-shell:
    {{ compose }} exec db mysql -u portfolio -pportfolio portfolio

# ─────────────────────────────────────────────────────────────────────────────
# Backend
# ─────────────────────────────────────────────────────────────────────────────

# Open bash shell in backend container
backend-shell:
    {{ compose }} exec backend bash

# Run pytest
test *args:
    {{ compose }} exec backend uv run pytest {{ args }}

# Run ruff check (linting)
lint:
    {{ compose }} exec backend uv run ruff check src tests

# Run ruff format (auto-fix formatting)
format:
    {{ compose }} exec backend uv run ruff format src tests

# Run ruff check with auto-fix
lint-fix:
    {{ compose }} exec backend uv run ruff check --fix src tests

# ─────────────────────────────────────────────────────────────────────────────
# Frontend
# ─────────────────────────────────────────────────────────────────────────────

# Open bash shell in frontend container
frontend-shell:
    {{ compose }} exec frontend bash

# Run Angular tests
frontend-test:
    {{ compose }} exec frontend npm test

# Run ng commands (e.g., just ng generate component foo)
ng *args:
    {{ compose }} exec frontend npx ng {{ args }}

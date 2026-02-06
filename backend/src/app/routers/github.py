import time
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.app.config import get_settings

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/github", tags=["github"])

# Simple in-memory cache: { "data": ..., "timestamp": ... }
_cache: dict = {}
_CACHE_TTL = 3600  # 1 hour in seconds

GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
GITHUB_USERNAME = "Geno-Claw"

CONTRIBUTIONS_QUERY = """
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    createdAt
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoriesWithContributedCommits
    }
  }
}
"""

LEVEL_MAP = {
    "NONE": 0,
    "FIRST_QUARTILE": 1,
    "SECOND_QUARTILE": 2,
    "THIRD_QUARTILE": 3,
    "FOURTH_QUARTILE": 4,
}


def _calculate_account_age(created_at: str) -> str:
    """Return a human-readable account age string."""
    created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    now = datetime.now(timezone.utc)
    delta = now - created

    years = delta.days // 365
    months = (delta.days % 365) // 30

    if years > 0:
        parts = [f"{years}y"]
        if months > 0:
            parts.append(f"{months}mo")
        return " ".join(parts)
    elif months > 0:
        return f"{months}mo"
    else:
        return f"{delta.days}d"


@router.get("/contributions")
@limiter.limit("30/minute")
async def get_contributions(request: Request):
    """Fetch GitHub contribution data for Geno-Claw."""
    now = time.time()

    # Return cached data if fresh
    if _cache.get("data") and (now - _cache.get("timestamp", 0)) < _CACHE_TTL:
        return _cache["data"]

    settings = get_settings()
    token = settings.github_pat

    if not token:
        raise HTTPException(
            status_code=503,
            detail="GitHub integration is not configured",
        )

    # Last 30 days
    to_date = datetime.now(timezone.utc)
    from_date = datetime(
        to_date.year if to_date.month > 1 else to_date.year - 1,
        to_date.month - 1 if to_date.month > 1 else 12,
        to_date.day,
        tzinfo=timezone.utc,
    )

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            GITHUB_GRAPHQL_URL,
            json={
                "query": CONTRIBUTIONS_QUERY,
                "variables": {
                    "username": GITHUB_USERNAME,
                    "from": from_date.isoformat(),
                    "to": to_date.isoformat(),
                },
            },
            headers=headers,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="Failed to fetch GitHub data",
        )

    data = response.json()

    if "errors" in data:
        raise HTTPException(
            status_code=502,
            detail="GitHub API returned an error",
        )

    user = data["data"]["user"]
    collection = user["contributionsCollection"]
    calendar = collection["contributionCalendar"]

    # Build sanitized response
    weeks = []
    for week in calendar["weeks"]:
        days = []
        for day in week["contributionDays"]:
            days.append({
                "date": day["date"],
                "count": day["contributionCount"],
                "level": LEVEL_MAP.get(day["contributionLevel"], 0),
            })
        weeks.append({"days": days})

    result = {
        "totalContributions": calendar["totalContributions"],
        "commits": collection["totalCommitContributions"],
        "pullRequests": collection["totalPullRequestContributions"],
        "issues": collection["totalIssueContributions"],
        "repositoriesContributedTo": collection["totalRepositoriesWithContributedCommits"],
        "weeks": weeks,
        "accountAge": _calculate_account_age(user["createdAt"]),
    }

    # Cache the result
    _cache["data"] = result
    _cache["timestamp"] = now

    return result

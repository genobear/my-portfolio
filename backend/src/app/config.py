from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "mysql+pymysql://portfolio:portfolio@db:3306/portfolio"
    debug: bool = False
    cors_origins: str = "http://localhost:4200,http://localhost"
    github_pat: str = ""

    @property
    def sqlalchemy_database_url(self) -> str:
        """Ensure the DATABASE_URL uses the pymysql driver."""
        url = self.database_url
        if url.startswith("mysql://"):
            url = url.replace("mysql://", "mysql+pymysql://", 1)
        return url

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

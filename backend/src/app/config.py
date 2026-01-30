from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "mysql+pymysql://portfolio:portfolio@db:3306/portfolio"
    debug: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()

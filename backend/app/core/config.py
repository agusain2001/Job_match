import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Job Match API"
    GOOGLE_API_KEY: str = "AIzaSyANF2I2pcdaFHtbzM4EeEy4CDmoBfV1n7I"
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()

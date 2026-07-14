from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.Settings import settings
from app.core.limiter import limiter
from app.db.connection import connect_to_mongo, close_mongo_connection
from app.routes.auth_routes import router as auth_router
from app.routes.profile_routes import router as profile_router
from app.routes.admin_routes import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


def create_app() -> FastAPI:
    app = FastAPI(title="Trust Ride", lifespan=lifespan)

    app.state.limiter = limiter

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_URL],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"message": "Validation error", "errors": jsonable_encoder(exc.errors())},
        )

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exception_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={"message": "Too many requests, please try again later"},
        )

    @app.get("/health")
    async def health_check():
        return {
            "status": "ok",
            "database": "connected"
        }

    app.include_router(auth_router)
    app.include_router(profile_router)
    app.include_router(admin_router)

    return app


app = create_app()

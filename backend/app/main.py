from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.connection import connect_to_mongo, close_mongo_connection, connect_to_redis, close_redis_connection, get_db
from app.middlewares.rate_limit_middleware import register_rate_limiter
from app.services.admin_service import ensure_default_admin
from app.routes.user_routes import router as user_router
from app.routes.driver_routes import router as driver_router
from app.routes.admin_routes import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await connect_to_redis()
    await ensure_default_admin(get_db())
    yield
    await close_mongo_connection()
    await close_redis_connection()


def create_app() -> FastAPI:
    app = FastAPI(title="Role Based Authentication System", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_rate_limiter(app)

    app.include_router(user_router)
    app.include_router(driver_router)
    app.include_router(admin_router)

    @app.get("/health")
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()

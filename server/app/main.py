from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from app.core.Settings import settings
from app.db.connection import connect_to_mongo, close_mongo_connection, get_db
from app.services.admin_service import ensure_default_admin
from app.routes.user_routes import router as user_router
from app.routes.driver_routes import router as driver_router
from app.routes.admin_routes import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await ensure_default_admin(get_db())
    yield
    await close_mongo_connection()


def create_app() -> FastAPI:
    app = FastAPI(title="Role Based Authentication System", lifespan=lifespan)

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

    app.include_router(user_router)
    app.include_router(driver_router)
    app.include_router(admin_router)

    @app.get("/health")
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()

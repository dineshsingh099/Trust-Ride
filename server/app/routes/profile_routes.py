from fastapi import APIRouter, Depends
from app.controllers.profile_controller import ProfileController
from app.middlewares.auth_middleware import get_current_user
from app.schemas.user_schema import (
    ProfileUpdateSchema,
    UserResponseSchema,
    MessageResponseSchema
)

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/", response_model=UserResponseSchema)
async def get_profile(user: dict = Depends(get_current_user)):
    return await ProfileController.get_profile(user)


@router.put("/", response_model=UserResponseSchema)
async def update_profile(data: ProfileUpdateSchema, user: dict = Depends(get_current_user)):
    return await ProfileController.update_profile(user, data)


@router.delete("/", response_model=MessageResponseSchema)
async def delete_account(user: dict = Depends(get_current_user)):
    return await ProfileController.delete_account(user)

from fastapi import HTTPException, status
from app.services.profile_services import ProfileService
from app.schemas.user_schema import ProfileUpdateSchema

class ProfileController:
    @staticmethod
    async def get_profile(user: dict):
        try:
            return await ProfileService.get_profile(user)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def update_profile(user: dict, data: ProfileUpdateSchema):
        try:
            return await ProfileService.update_profile(user, data)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def delete_account(user: dict):
        try:
            return await ProfileService.delete_account(user)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

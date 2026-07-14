from app.repository.auth_repository import UserRepository
from app.repository.token_repository import TokenRepository
from app.schemas.user_schema import ProfileUpdateSchema


class ProfileService:

    @staticmethod
    def _serialize(user: dict) -> dict:
        return {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": user.get("role", "user"),
            "is_verified": user.get("is_verified", False),
            "is_active": user.get("is_active", True),
        }

    @staticmethod
    async def get_profile(user: dict):
        return ProfileService._serialize(user)

    @staticmethod
    async def update_profile(user: dict, data: ProfileUpdateSchema):
        update_data = {}

        if data.full_name is not None:
            update_data["full_name"] = data.full_name

        if data.phone is not None:
            update_data["phone"] = data.phone

        if not update_data:
            raise Exception("No data provided to update")

        user_id = str(user["_id"])
        await UserRepository.update(user_id, update_data)
        updated_user = await UserRepository.get_by_id(user_id)

        return ProfileService._serialize(updated_user)

    @staticmethod
    async def delete_account(user: dict):
        user_id = str(user["_id"])

        await UserRepository.delete(user_id)
        await TokenRepository.delete_all_for_user(user_id)

        return {"message": "Account deleted successfully"}

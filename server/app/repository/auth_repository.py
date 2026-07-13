from datetime import datetime
from bson import ObjectId
from app.db.connection import get_db
from app.models.user_model import UserModel


class UserRepository:

    @staticmethod
    async def create(user: UserModel):
        db = get_db()

        result = await db.users.insert_one(
            user.model_dump(exclude={"id"})
        )

        return str(result.inserted_id)

    @staticmethod
    async def get_by_id(user_id: str):
        db = get_db()

        return await db.users.find_one(
            {"_id": ObjectId(user_id)}
        )

    @staticmethod
    async def get_by_email(email: str):
        db = get_db()

        return await db.users.find_one(
            {"email": email}
        )

    @staticmethod
    async def get_by_phone(phone: str):
        db = get_db()

        return await db.users.find_one(
            {"phone": phone}
        )

    @staticmethod
    async def update(user_id: str, data: dict):
        db = get_db()

        data["updated_at"] = datetime.utcnow()

        return await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": data}
        )

    @staticmethod
    async def delete(user_id: str):
        db = get_db()

        return await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_deleted": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )

    @staticmethod
    async def update_last_login(user_id: str):
        db = get_db()

        return await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "last_login": datetime.utcnow()
                }
            }
        )

    @staticmethod
    async def verify_user(user_id: str):
        db = get_db()

        return await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_verified": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )

    @staticmethod
    async def list_users(skip: int = 0, limit: int = 20):
        db = get_db()

        users = await db.users.find(
            {"is_deleted": False}
        ).skip(skip).limit(limit).to_list(length=limit)

        return users
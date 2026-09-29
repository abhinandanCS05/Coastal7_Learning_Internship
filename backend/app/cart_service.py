from app.redis_service import cart_key, delete_key, get_json, set_json

async def get_cart(user_id: int) -> list[dict]:
    return await get_json(cart_key(user_id)) or []

async def save_cart(user_id: int, items: list[dict]) -> list[dict]:
    await set_json(cart_key(user_id), items, ttl=3600)
    return items

async def clear_cart(user_id: int) -> None:
    await delete_key(cart_key(user_id))

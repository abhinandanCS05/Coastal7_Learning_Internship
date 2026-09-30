from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        # Customer connections:
        # user_id -> list of active WebSocket connections
        self.user_connections: dict[int, list[WebSocket]] = defaultdict(list)

        # Admin dashboard connections
        self.admin_connections: list[WebSocket] = []

    # ========================================================
    # CUSTOMER CONNECTIONS
    # ========================================================

    async def connect(
        self,
        user_id: int,
        websocket: WebSocket,
    ) -> None:
        await websocket.accept()

        self.user_connections[user_id].append(
            websocket
        )

    def disconnect(
        self,
        user_id: int,
        websocket: WebSocket,
    ) -> None:

        connections = self.user_connections.get(
            user_id,
            [],
        )

        if websocket in connections:
            connections.remove(websocket)

        if not connections:
            self.user_connections.pop(
                user_id,
                None,
            )

    async def send_to_user(
        self,
        user_id: int,
        message: dict,
    ) -> None:

        connections = self.user_connections.get(
            user_id,
            [],
        )

        disconnected = []

        for websocket in connections:
            try:
                await websocket.send_json(
                    message
                )
            except Exception:
                disconnected.append(
                    websocket
                )

        for websocket in disconnected:
            self.disconnect(
                user_id,
                websocket,
            )

    # ========================================================
    # ADMIN CONNECTIONS
    # ========================================================

    async def connect_admin(
        self,
        websocket: WebSocket,
    ) -> None:

        await websocket.accept()

        self.admin_connections.append(
            websocket
        )

    def disconnect_admin(
        self,
        websocket: WebSocket,
    ) -> None:

        if websocket in self.admin_connections:
            self.admin_connections.remove(
                websocket
            )

    async def broadcast_admin(
        self,
        message: dict,
    ) -> None:

        disconnected = []

        for websocket in self.admin_connections:
            try:
                await websocket.send_json(
                    message
                )
            except Exception:
                disconnected.append(
                    websocket
                )

        for websocket in disconnected:
            self.disconnect_admin(
                websocket
            )


# Global connection manager
manager = ConnectionManager()
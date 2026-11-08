from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await self.broadcast(
            {
                "type": "user_joined",
                "username": username,
            }
        )

        self.active_connections[websocket] = username

    async def disconnect(self, websocket: WebSocket):
        username = self.active_connections.pop(websocket, None)

        if username:
            await self.broadcast(
                {
                    "type": "user_left",
                    "username": username,
                }
            )

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            await connection.send_json(message)

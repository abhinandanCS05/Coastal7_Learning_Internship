import asyncio

import websockets


async def main() -> None:
    async with websockets.connect("ws://127.0.0.1:8000/ws") as websocket:
        print("Connected:", await websocket.recv())
        await websocket.send("Hello from WebSocket client")
        print("Echo:", await websocket.recv())
        print("Waiting for upload notification...")
        while True:
            print("Notification:", await websocket.recv())


if __name__ == "__main__":
    asyncio.run(main())

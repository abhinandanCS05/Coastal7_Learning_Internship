import asyncio
import json
import sys
import websockets

async def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python client_websocket.py <access_token>")
        return
    token = sys.argv[1]
    uri = f"ws://127.0.0.1:8000/ws/orders?token={token}"
    async with websockets.connect(uri) as websocket:
        print("Connected:", await websocket.recv())
        await websocket.send("hello")
        print("Echo:", await websocket.recv())
        print("Waiting for order-status notification...")
        while True:
            message = await websocket.recv()
            print("Notification:", json.loads(message))

if __name__ == "__main__":
    asyncio.run(main())

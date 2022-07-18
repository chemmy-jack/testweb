import asyncio
import logging
import websockets

logging.basicConfig(level=logging.INFO)

ws_ip = "ws://localhost:8000"

async def consumer_handler(websocket : WebSocketClientProtocol) -> None :
    async for message in websocket :
        log_message(message)


async def consume(hostname: str, port: int) -> None :
    async with websockets.connect(ws_ip) as websocket:
        await consumer_handler(websocket)

def log_message(message: srt) -> None:
    logging.info(f"Message: {message}")

if __name__ == "__main__" :




from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()  # WebSocket接続を受け入れる
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)  # 非同期でメッセージを送信

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)  # 非同期でメッセージをブロードキャスト

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            print(f"Client #{client_id} waiting for message...")
            data = await websocket.receive_text()  # クライアントからのメッセージを受信
            await manager.send_personal_message(f"you wrote: {data}", websocket)
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat")

"""Browser tests use the existing FastAPI factory + real FFmpeg; only inference is fake."""
import sys
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "ai-service"))

import imageio_ffmpeg
import uvicorn
from app.config import Settings
from app.main import create_app


class TestChatEngine:
    state = "ready"

    async def start(self):
        pass

    async def close(self):
        pass

    async def generate(self, payload):
        await asyncio.sleep(0.15)
        return f"TEST ONLY [{payload.language}] {len(payload.messages)} messages: {payload.messages[-1].content}"


class TestEngine:
    loaded = set()
    last_error = None

    async def transcribe(self, language, samples):
        assert samples.ndim == 1 and len(samples) > 0
        self.loaded.add(language)
        return "Ẹ káàárọ̀" if language == "yo" else "Good morning from Nigeria."

    async def close(self):
        pass


if __name__ == "__main__":
    app = create_app(Settings(_env_file=None,
        ai_service_token="browser-test-service-token-only-00000000",
        natlas_enabled=False,
        ffmpeg_binary=imageio_ffmpeg.get_ffmpeg_exe()), engine=TestEngine(), chat_engine=TestChatEngine())
    uvicorn.run(app, host="127.0.0.1", port=8101, access_log=False)

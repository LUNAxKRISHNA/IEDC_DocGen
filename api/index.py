"""
Vercel Serverless Entry Point for the IEDC DocGen FastAPI backend.

Vercel routes /api/* requests to this file. Because FastAPI routes are defined
at root paths (/templates, /preview, etc.), we strip the /api prefix before
passing requests to FastAPI using a lightweight ASGI wrapper.
"""

import os
import sys

# Make the backend package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app as _fastapi_app  # noqa: E402


class StripApiPrefix:
    """
    ASGI middleware that strips the /api prefix Vercel adds to requests
    before forwarding them to the FastAPI application.
    """

    def __init__(self, inner_app, prefix: str = "/api"):
        self.app = inner_app
        self.prefix = prefix

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            path: str = scope.get("path", "")
            if path.startswith(self.prefix):
                new_path = path[len(self.prefix):] or "/"
                scope = dict(scope)
                scope["path"] = new_path
                raw: bytes = scope.get("raw_path", b"")
                prefix_bytes = self.prefix.encode()
                if raw.startswith(prefix_bytes):
                    scope["raw_path"] = raw[len(prefix_bytes):] or b"/"
        await self.app(scope, receive, send)


# This is the ASGI app Vercel will call
app = StripApiPrefix(_fastapi_app)

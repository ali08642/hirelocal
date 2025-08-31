from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Cross-Origin-Opener-Policy"] = "unsafe-none"
        response.headers["Cross-Origin-Embedder-Policy"] = "unsafe-none"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

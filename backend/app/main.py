from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import AsyncSessionLocal, init_db
from app.routes import address, auth, cart, orders, products
from app.seed import seed_products
from prometheus_fastapi_instrumentator import Instrumentator



app = FastAPI(title="CartLabs API", version="1.0.0")
Instrumentator().instrument(app).expose(app)

@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    messages = []
    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", []) if part != "body")
        prefix = f"{location}: " if location else ""
        messages.append(f"{prefix}{error.get('msg', 'Invalid value')}")
    return JSONResponse(
        status_code=422,
        content={"detail": "; ".join(messages) or "Invalid request"},
    )


@app.on_event("startup")
async def on_startup() -> None:
    await init_db()
    async with AsyncSessionLocal() as db:
        await seed_products(db)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(address.router)
app.include_router(orders.router)

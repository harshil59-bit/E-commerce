from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas.cart import CartAdd, CartOut, CartRemove, CartUpdate
from app.services.cart_service import add_to_cart, get_cart, remove_cart_item, update_cart_item

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartOut)
async def read_cart(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> CartOut:
    return await get_cart(db, user.id)


@router.post("/add", response_model=CartOut)
async def add_item(payload: CartAdd, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> CartOut:
    try:
        return await add_to_cart(db, user.id, payload.product_id, payload.quantity)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/update", response_model=CartOut)
async def update_item(
    payload: CartUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
) -> CartOut:
    try:
        return await update_cart_item(db, user.id, payload.product_id, payload.quantity)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/remove", response_model=CartOut)
async def remove_item(
    payload: CartRemove, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
) -> CartOut:
    return await remove_cart_item(db, user.id, payload.product_id)

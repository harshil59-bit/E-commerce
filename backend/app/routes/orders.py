from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Order, OrderItem, User
from app.schemas.order import OrderOut
from app.services.order_service import create_order_from_cart, get_order

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderOut, status_code=201)
async def confirm_order(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> Order:
    return await create_order_from_cart(db, user.id)


@router.get("", response_model=list[OrderOut])
async def list_orders(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> list[Order]:
    return list(
        await db.scalars(
            select(Order)
            .where(Order.user_id == user.id)
            .options(selectinload(Order.items).selectinload(OrderItem.product))
            .order_by(Order.created_at.desc())
        )
    )


@router.get("/{order_id}", response_model=OrderOut)
async def read_order(order_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> Order:
    return await get_order(db, user.id, order_id)

from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Address, CartItem, Order, OrderItem


async def create_order_from_cart(db: AsyncSession, user_id: int) -> Order:
    primary_address = await db.scalar(select(Address).where(Address.user_id == user_id, Address.is_primary.is_(True)))
    if not primary_address:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Select a primary address before checkout")

    cart_items = list(
        await db.scalars(
            select(CartItem).where(CartItem.user_id == user_id).options(selectinload(CartItem.product))
        )
    )
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    total = sum((item.product.price * item.quantity for item in cart_items), Decimal("0.00"))
    order = Order(user_id=user_id, total_price=total)
    db.add(order)
    await db.flush()

    for item in cart_items:
        db.add(OrderItem(order_id=order.id, product_id=item.product_id, quantity=item.quantity, price=item.product.price))

    await db.execute(delete(CartItem).where(CartItem.user_id == user_id))
    await db.commit()
    return await get_order(db, user_id, order.id)


async def get_order(db: AsyncSession, user_id: int, order_id: int) -> Order:
    order = await db.scalar(
        select(Order)
        .where(Order.id == order_id, Order.user_id == user_id)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

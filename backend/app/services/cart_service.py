from decimal import Decimal

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import CartItem, Product
from app.schemas.cart import CartItemOut, CartOut


async def get_cart(db: AsyncSession, user_id: int) -> CartOut:
    result = await db.scalars(
        select(CartItem)
        .where(CartItem.user_id == user_id)
        .options(selectinload(CartItem.product))
        .order_by(CartItem.id.desc())
    )
    items = list(result)
    total = Decimal("0.00")
    output: list[CartItemOut] = []
    for item in items:
        line_total = item.product.price * item.quantity
        total += line_total
        output.append(CartItemOut(id=item.id, quantity=item.quantity, product=item.product, line_total=line_total))
    return CartOut(items=output, total_price=total)


async def add_to_cart(db: AsyncSession, user_id: int, product_id: int, quantity: int) -> CartOut:
    product = await db.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise ValueError("Product not found")

    item = await db.scalar(select(CartItem).where(CartItem.user_id == user_id, CartItem.product_id == product_id))
    if item:
        item.quantity += quantity
    else:
        db.add(CartItem(user_id=user_id, product_id=product_id, quantity=quantity))
    await db.commit()
    return await get_cart(db, user_id)


async def update_cart_item(db: AsyncSession, user_id: int, product_id: int, quantity: int) -> CartOut:
    item = await db.scalar(select(CartItem).where(CartItem.user_id == user_id, CartItem.product_id == product_id))
    if not item:
        raise ValueError("Cart item not found")
    item.quantity = quantity
    await db.commit()
    return await get_cart(db, user_id)


async def remove_cart_item(db: AsyncSession, user_id: int, product_id: int) -> CartOut:
    await db.execute(delete(CartItem).where(CartItem.user_id == user_id, CartItem.product_id == product_id))
    await db.commit()
    return await get_cart(db, user_id)

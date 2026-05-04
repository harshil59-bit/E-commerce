from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import distinct, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Product, User
from app.schemas.product import ProductListOut, ProductOut

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListOut)
async def list_products(
    search: str | None = None,
    category: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=8, ge=1, le=48),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ProductListOut:
    filters = []
    if search:
        term = f"%{search.lower()}%"
        filters.append(or_(func.lower(Product.name).like(term), func.lower(Product.description).like(term)))
    if category:
        filters.append(Product.category == category)

    base = select(Product).where(*filters)
    total = await db.scalar(select(func.count()).select_from(base.subquery()))
    products = list(await db.scalars(base.order_by(Product.id).offset((page - 1) * page_size).limit(page_size)))
    categories = list(await db.scalars(select(distinct(Product.category)).order_by(Product.category)))
    return ProductListOut(items=products, total=total or 0, page=page, page_size=page_size, categories=categories)


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Product:
    product = await db.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/{product_id}/similar", response_model=list[ProductOut])
async def similar_products(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Product]:
    product = await db.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return list(
        await db.scalars(
            select(Product).where(Product.category == product.category, Product.id != product_id).limit(4)
        )
    )

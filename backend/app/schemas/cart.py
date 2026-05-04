from decimal import Decimal

from pydantic import BaseModel, Field

from app.schemas.product import ProductOut


class CartAdd(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=99)


class CartUpdate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=99)


class CartRemove(BaseModel):
    product_id: int


class CartItemOut(BaseModel):
    id: int
    quantity: int
    product: ProductOut
    line_total: Decimal


class CartOut(BaseModel):
    items: list[CartItemOut]
    total_price: Decimal

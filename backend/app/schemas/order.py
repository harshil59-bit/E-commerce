from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.schemas.product import ProductOut


class OrderItemOut(BaseModel):
    id: int
    quantity: int
    price: Decimal
    product: ProductOut

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    total_price: Decimal
    status: str
    created_at: datetime
    items: list[OrderItemOut]

    model_config = {"from_attributes": True}

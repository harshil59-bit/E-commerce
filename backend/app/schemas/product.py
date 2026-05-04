from decimal import Decimal

from pydantic import BaseModel


class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: Decimal
    image_url: str
    category: str
    rating: Decimal

    model_config = {"from_attributes": True}


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    page_size: int
    categories: list[str]

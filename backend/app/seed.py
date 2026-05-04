from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Product


SAMPLE_PRODUCTS = [
    {
        "name": "CartLabs SonicPods Pro",
        "description": "Adaptive noise cancellation, spatial audio, and 30-hour battery life in a compact charging case.",
        "price": Decimal("129.99"),
        "image_url": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
        "category": "Electronics",
        "rating": Decimal("4.7"),
    },
    {
        "name": "AeroBook 14 Laptop",
        "description": "Lightweight productivity laptop with 16GB RAM, 512GB SSD, and a bright 14-inch display.",
        "price": Decimal("899.00"),
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
        "category": "Electronics",
        "rating": Decimal("4.6"),
    },
    {
        "name": "SummitTrail Backpack",
        "description": "Weather-resistant 28L backpack with padded laptop storage and organized travel pockets.",
        "price": Decimal("74.50"),
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        "category": "Travel",
        "rating": Decimal("4.5"),
    },
    {
        "name": "UrbanStep Sneakers",
        "description": "Breathable knit sneakers with cushioned soles for everyday city miles.",
        "price": Decimal("68.00"),
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        "category": "Fashion",
        "rating": Decimal("4.4"),
    },
    {
        "name": "Nordic Brew Coffee Maker",
        "description": "Programmable drip coffee maker with thermal carafe and bloom-cycle extraction.",
        "price": Decimal("112.75"),
        "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80",
        "category": "Home",
        "rating": Decimal("4.3"),
    },
    {
        "name": "FocusFlow Desk Lamp",
        "description": "Dimmable LED desk lamp with warm/cool modes, USB-C charging, and low-glare optics.",
        "price": Decimal("45.99"),
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        "category": "Home",
        "rating": Decimal("4.6"),
    },
    {
        "name": "PulseFit Smartwatch",
        "description": "Fitness tracking, notifications, sleep insights, and seven-day battery life.",
        "price": Decimal("159.00"),
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        "category": "Electronics",
        "rating": Decimal("4.5"),
    },
    {
        "name": "CloudSoft Cotton Hoodie",
        "description": "Midweight brushed-fleece hoodie with a relaxed fit and durable ribbed cuffs.",
        "price": Decimal("54.25"),
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
        "category": "Fashion",
        "rating": Decimal("4.2"),
    },
    {
        "name": "ChefCore Pan Set",
        "description": "Three-piece nonstick cookware set with stay-cool handles and induction compatibility.",
        "price": Decimal("86.40"),
        "image_url": "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
        "category": "Kitchen",
        "rating": Decimal("4.4"),
    },
    {
        "name": "HydraSteel Bottle",
        "description": "Insulated stainless-steel bottle that keeps drinks cold for 24 hours or hot for 12.",
        "price": Decimal("29.95"),
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
        "category": "Travel",
        "rating": Decimal("4.8"),
    },
]


async def seed_products(db: AsyncSession) -> None:
    existing_count = await db.scalar(select(Product.id).limit(1))
    if existing_count:
        return
    db.add_all(Product(**product) for product in SAMPLE_PRODUCTS)
    await db.commit()

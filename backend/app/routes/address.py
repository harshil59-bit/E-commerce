from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Address, User
from app.schemas.address import AddressCreate, AddressOut, PrimaryAddressSelect

router = APIRouter(prefix="/address", tags=["Address"])


@router.post("", response_model=AddressOut, status_code=201)
async def add_address(
    payload: AddressCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
) -> Address:
    has_address = await db.scalar(select(Address).where(Address.user_id == user.id).limit(1))
    is_primary = payload.is_primary or not has_address
    if is_primary:
        await db.execute(update(Address).where(Address.user_id == user.id).values(is_primary=False))
    address = Address(user_id=user.id, **payload.model_dump(exclude={"is_primary"}), is_primary=is_primary)
    db.add(address)
    await db.commit()
    await db.refresh(address)
    return address


@router.get("", response_model=list[AddressOut])
async def list_addresses(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)) -> list[Address]:
    return list(await db.scalars(select(Address).where(Address.user_id == user.id).order_by(Address.is_primary.desc(), Address.id.desc())))


@router.put("/select-primary", response_model=list[AddressOut])
async def select_primary(
    payload: PrimaryAddressSelect, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
) -> list[Address]:
    address = await db.scalar(select(Address).where(Address.id == payload.address_id, Address.user_id == user.id))
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    await db.execute(update(Address).where(Address.user_id == user.id).values(is_primary=False))
    address.is_primary = True
    await db.commit()
    return list(await db.scalars(select(Address).where(Address.user_id == user.id).order_by(Address.is_primary.desc(), Address.id.desc())))

from pydantic import BaseModel, Field


class AddressCreate(BaseModel):
    flat: str = Field(min_length=1, max_length=80)
    building: str = Field(min_length=1, max_length=160)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(min_length=4, max_length=12)
    is_primary: bool = False


class AddressOut(AddressCreate):
    id: int
    user_id: int

    model_config = {"from_attributes": True}


class PrimaryAddressSelect(BaseModel):
    address_id: int

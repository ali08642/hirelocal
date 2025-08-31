from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class UserProfile(BaseModel):
    name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None
    radiusKm: Optional[int] = 25
    localeType: Optional[str] = None
    notifications: Dict = Field(default_factory=lambda: {
        "emailUpdates": True,
        "providerReplies": True,
        "recommendations": True,
        "marketing": False,
        "security": True
    })
    privacy: Dict = Field(default_factory=lambda: {
        "showProfilePublic": False,
        "shareActivity": False,
        "aiPersonalization": True,
        "dataCollection": True
    })

class BusinessData(BaseModel):
    name: str
    rating: str
    reviews: int
    phone: str
    address: str
    website: Optional[str] = None
    sources: List[str]
    rank: Optional[int] = None
    confidence: str = Field(...)  # HIGH, MEDIUM, or LOW

class CategoryCreate(BaseModel):
    name: str
    iconName: str
    active: bool = True

class ActivityLog(BaseModel):
    type: str  # user, search, system, provider
    message: str
    userId: Optional[str] = None
    userEmail: Optional[str] = None
    details: Dict = Field(default_factory=dict)

class SearchQuery(BaseModel):
    category: str
    location: str
    userId: str

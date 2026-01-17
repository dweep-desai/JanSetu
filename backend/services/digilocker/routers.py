"""DigiLocker service routers."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from .models import DigiLockerAccount, DigiLockerDocument, Base
from .database import get_db, engine

router = APIRouter()

# Initialize database
Base.metadata.create_all(bind=engine)

# Pydantic models
class LinkRequest(BaseModel):
    digilocker_id: str
    user_id: int

class FetchRequest(BaseModel):
    user_id: int
    doc_type: str
    issuer: str
    params: Dict[str, Any]

@router.post("/link")
async def link_digilocker(request: LinkRequest, db: Session = Depends(get_db)):
    """Link user account to DigiLocker."""
    # Check if already linked
    existing = db.query(DigiLockerAccount).filter(DigiLockerAccount.user_id == request.user_id).first()
    if existing:
        existing.digilocker_id = request.digilocker_id
        db.commit()
        return {"status": "updated", "message": "DigiLocker linked successfully"}
    
    account = DigiLockerAccount(user_id=request.user_id, digilocker_id=request.digilocker_id)
    db.add(account)
    db.commit()
    
    # Mock: Seed some initial documents for demo
    seed_documents(request.user_id, db)
    
    return {"status": "success", "message": "DigiLocker linked successfully"}

@router.get("/my-documents")
async def get_documents(user_id: int, db: Session = Depends(get_db)):
    """Get user's documents."""
    account = db.query(DigiLockerAccount).filter(DigiLockerAccount.user_id == user_id).first()
    
    if not account:
         return {"linked": False, "documents": []}
         
    docs = db.query(DigiLockerDocument).filter(DigiLockerDocument.user_id == user_id).all()
    
    return {
        "linked": True,
        "digilocker_id": account.digilocker_id,
        "documents": [
            {
                "id": d.id,
                "title": d.title,
                "doc_type": d.doc_type,
                "issuer": d.issuer,
                "issued_date": d.issued_date,
                "size": d.size
            } for d in docs
        ]
    }

@router.post("/fetch")
async def fetch_document(request: FetchRequest, db: Session = Depends(get_db)):
    """Simulate fetching a document from issuer."""
    account = db.query(DigiLockerAccount).filter(DigiLockerAccount.user_id == request.user_id).first()
    if not account:
        raise HTTPException(status_code=400, detail="DigiLocker not linked")
        
    # Mock fetching logic based on doc_type
    doc_title = get_doc_title(request.doc_type)
    
    # Check if already exists
    existing = db.query(DigiLockerDocument).filter(
        DigiLockerDocument.user_id == request.user_id,
        DigiLockerDocument.doc_type == request.doc_type
    ).first()
    
    if existing:
        return {"status": "exists", "message": "Document already in locker"}
        
    new_doc = DigiLockerDocument(
        user_id=request.user_id,
        title=doc_title,
        doc_type=request.doc_type,
        issuer=request.issuer,
        issued_date="2024-01-18",
        size="1.2 MB"
    )
    db.add(new_doc)
    db.commit()
    
    return {"status": "success", "message": f"{doc_title} fetched successfully"}

def get_doc_title(doc_type: str) -> str:
    titles = {
        "aadhaar": "Aadhaar Card",
        "pan": "PAN Verification Record",
        "driving_license": "Driving License",
        "rc": "Registration Certificate",
        "class_x": "Class X Marksheet",
        "class_xii": "Class XII Marksheet",
        "birth_cert": "Birth Certificate"
    }
    return titles.get(doc_type, "Official Document")

def seed_documents(user_id: int, db: Session):
    """Seed initial documents."""
    initial_docs = [
        {
            "title": "Aadhaar Card",
            "doc_type": "aadhaar",
            "issuer": "UIDAI",
            "issued_date": "2020-05-15",
            "size": "500 KB"
        }
    ]
    
    for doc in initial_docs:
        exists = db.query(DigiLockerDocument).filter(
            DigiLockerDocument.user_id == user_id, 
            DigiLockerDocument.doc_type == doc["doc_type"]
        ).first()
        
        if not exists:
            new_doc = DigiLockerDocument(
                user_id=user_id,
                **doc
            )
            db.add(new_doc)
    db.commit()

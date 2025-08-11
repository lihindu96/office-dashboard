from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from app.database import db

router = APIRouter()

class GatePassData(BaseModel):
    supplier_name: str
    po_number: str
    driver_name: str
    lorry_number: str
    item_quantity: int
    bay_number: str
    arrival_time: datetime
    departure_time: datetime
    item_description: str
    security_signature: str = None
    receiver_signature: str = None

@router.post("/gatepass/")
async def create_gate_pass(data: GatePassData):
    try:
        doc_ref = db.collection("gate_passes").document()
        doc_ref.set(data.dict())
        return {"id": doc_ref.id, "status": "Gate Pass Created", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating gate pass: {e}")

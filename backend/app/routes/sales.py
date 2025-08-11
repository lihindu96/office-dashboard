from fastapi import APIRouter, HTTPException
from app.database import db
import uuid
from firebase_admin import firestore  # Needed for SERVER_TIMESTAMP

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post("/")
def create_sale(data: dict):
    try:
        sale_id = str(uuid.uuid4())

        # Write to Firestore with a server-side timestamp
        firestore_data = data.copy()
        firestore_data["timestamp"] = firestore.SERVER_TIMESTAMP

        db.collection("sales").document(sale_id).set(firestore_data)

        return {
            "id": sale_id,
            "status": "created",
            "data": firestore.SERVER_TIMESTAMP  # Return only input data, not SERVER_TIMESTAMP
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating sale: {e}")

@router.get("/{sale_id}")
def get_sale(sale_id: str):
    try:
        doc_ref = db.collection("sales").document(sale_id)
        doc = doc_ref.get()
        if doc.exists:
            return {"id": doc.id, **doc.to_dict()}
        else:
            raise HTTPException(status_code=404, detail="Sale not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sale: {e}")

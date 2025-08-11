from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import time

router = APIRouter(prefix="/picking", tags=["picking"])

zones = ["A", "B", "S"]

# Store manually set stock per zone
stock_levels: Dict[str, int] = {zone: 300 for zone in zones}

# Store pick updates
pick_data: Dict[str, List[dict]] = {zone: [] for zone in zones}

# Models
class PickUpdate(BaseModel):
    zone: str
    lines_picked: int
    operator: str = "Unknown"  # Optional: Include operator/user field

class StockUpdate(BaseModel):
    zone: str
    stock: int

# POST: Update pick data manually
@router.post("/update")
def update_pick(pick: PickUpdate):
    if pick.zone not in pick_data:
        raise HTTPException(status_code=404, detail="Invalid zone")

    timestamp = int(time.time())
    pick_data[pick.zone].append({
        "lines_picked": pick.lines_picked,
        "timestamp": timestamp,
        "operator": pick.operator
    })

    return {"message": f"Updated Zone {pick.zone} with {pick.lines_picked} lines by {pick.operator}"}

# POST: Set starting stock per zone
@router.post("/set_stock")
def set_stock(stock: StockUpdate):
    if stock.zone not in zones:
        raise HTTPException(status_code=404, detail="Invalid zone")

    stock_levels[stock.zone] = stock.stock
    return {"message": f"Stock for Zone {stock.zone} set to {stock.stock}"}

# GET: Stats per zone
@router.get("/stats")
def get_stats():
    result = []
    current_time = int(time.time())

    for zone in zones:
        last_15 = [entry for entry in pick_data[zone] if current_time - entry["timestamp"] <= 900]
        total_15 = sum(entry["lines_picked"] for entry in last_15)
        total_all = sum(entry["lines_picked"] for entry in pick_data[zone])
        stock = stock_levels.get(zone, 300)
        remaining = max(0, stock - total_all)
        speed = total_15 * 4  # extrapolated to lines/hour
        eta = (remaining / (total_15 / 15)) if total_15 > 0 else None

        result.append({
            "zone": f"Zone {zone}",
            "stock": stock,
            "picked_last_15_min": total_15,
            "total_picked": total_all,
            "speed_lines_per_hour": speed,
            "remaining": remaining,
            "eta_minutes": round(eta, 2) if eta else "∞"
        })

    return result

# GET: Full pick history
@router.get("/history")
def get_history():
    history = []
    for zone in zones:
        total = 0
        for entry in pick_data[zone]:
            total += entry["lines_picked"]
            history.append({
                "zone": zone,
                "lines_picked": entry["lines_picked"],
                "timestamp": entry["timestamp"],
                "operator": entry.get("operator", "Unknown"),
                "total_until_now": total
            })

    history.sort(key=lambda x: x["timestamp"], reverse=True)
    return history


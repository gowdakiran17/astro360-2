
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from datetime import datetime

from astro_app.backend.database import get_db
from astro_app.backend.services.chat.engine import AstralEngine
from astro_app.backend.auth.router import get_current_user
from astro_app.backend.models import User, Chart

# We namespace this router to avoid conflict with potential v1 legacy routes, 
# although we deleted the old ones. Let's keep it clean as "ai_chat".
router = APIRouter(prefix="/chat", tags=["AI Chat Advanced"])
engine = AstralEngine()

class ChatRequest(BaseModel):
    message: str
    chart_id: Optional[int] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    logic_metadata: Dict
    session_id: str

@router.post("/v2/message", response_model=ChatResponse)
async def chat_message_v2(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Get User's Chart Data
    # Fetch from DB logic mirrors previous implementation but ensures we have a valid chart object
    chart = None
    if request.chart_id:
        chart = db.query(Chart).filter(Chart.id == request.chart_id, Chart.user_id == current_user.id).first()
    
    if not chart:
        # Fallback to default
        chart = db.query(Chart).filter(Chart.user_id == current_user.id, Chart.is_default == True).first()
        
    if not chart:
        # If still no chart, we can't run the engine logic
        return ChatResponse(
            response="To provide accurate astrological guidance, I need your birth chart. Please create one in your profile first.",
            session_id=request.session_id or "sess_new",
            logic_metadata={"error": "no_chart"}
        )

    # 2. Extract Raw Chart Data for Engine
    # Previously, calculate_chart would return this. 
    # For now, we assume we need to call the calculation service OR 
    # extract stored JSON from the chart record if cached.
    # Let's assume we fetch fresh data using existing service:
    from astro_app.backend.astrology.chart import calculate_chart
    
    # Re-construct dob details for calculation
    # NOTE: This assumes chart model has these fields stored correctly
    raw_data = calculate_chart(
        day=chart.date.day,
        month=chart.date.month,
        year=chart.date.year,
        hour=chart.time.hour,
        minute=chart.time.minute,
        lat=chart.latitude,
        lon=chart.longitude,
        tzone=chart.timezone
    )

    # 3. Call Astral Engine
    result = engine.process_query(
        user_query=request.message,
        raw_chart_data=raw_data,
        session_id=request.session_id or f"sess_{datetime.now().timestamp()}"
    )

    return ChatResponse(
        response=result.get("response", ""),
        logic_metadata=result.get("logic_metadata", {}),
        session_id=request.session_id or f"sess_{datetime.now().timestamp()}"
    )

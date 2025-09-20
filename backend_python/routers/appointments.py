from fastapi import APIRouter, HTTPException, Request
from models.appointment import Appointment, AppointmentCreate
from typing import List

router = APIRouter()

@router.get("/{user_id}", response_model=List[Appointment])
async def get_user_appointments(user_id: str, request: Request):
    """Get all appointments for a user"""
    try:
        appointments = await request.app.mongodb["appointments"].find({"userId": user_id}).to_list(1000)
        return appointments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Appointment, status_code=201)
async def create_appointment(appointment: AppointmentCreate, request: Request):
    """Create new appointment"""
    try:
        appointment_dict = appointment.dict()
        result = await request.app.mongodb["appointments"].insert_one(appointment_dict)
        created_appointment = await request.app.mongodb["appointments"].find_one({"_id": result.inserted_id})
        return created_appointment
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

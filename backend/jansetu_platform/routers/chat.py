from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
from ..config import settings

# Optional import for Groq - gracefully handle if not installed
try:
    from groq import Groq
    GROQ_AVAILABLE = True
    # Initialize Groq client only if available
    # Ensure GROQ_API_KEY is set in .env or config
    groq_api_key = getattr(settings, 'GROQ_API_KEY', '') or ''
    client = Groq(api_key=groq_api_key) if groq_api_key else None
except ImportError:
    GROQ_AVAILABLE = False
    client = None
    print("Warning: groq module not installed. Chat functionality will be disabled.")

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str

# System Prompt detailing JanSetu's capabilities
SYSTEM_PROMPT = """
You are the AI Assistant for JanSetu, a Unified Digital Public Infrastructure Platform in India.
Your goal is to help citizens navigate government services, schemes, and tools available on this platform.

**Key JanSetu Services & Features:**
1.  **Dashboard**: Central hub for all citizen services.
2.  **DigiLocker Integration**: Access and link documents like Aadhar, Driving Licence, PAN.
3.  **Financial Calculators**:
    *   **NPS (National Pension System)**: Calculate pension and maturity (7.1% interest).
    *   **EPF (Employees' Provident Fund)**: Check composite growth (8.25% interest).
    *   **PPF (Public Provident Fund)**: Investment calculator (7.1% interest).
    *   **APY (Atal Pension Yojana)**: Pension scheme for unorganized sector (7.94% interest).
    *   **FD TDR**: Fixed Deposit Tax Saving (Term Deposit) calculator (Dynamic interest).
4.  **Health Services**:
    *   Find **Hospitals Near Me**.
    *   **Medical Stores** locator.
    *   **Call Ambulance** (Emergency).
    *   **Blood Bank** search.
    *   **Search Medicines** (Generic alternatives).
    *   **e-Sanjeevani**: Tele-consultation with government doctors.
    *   **Patient Health Report**: Access health history via ABHA.
5.  **Transport Services**:
    *   **Book Public Transport**: Buses, Metro.
    *   **Fuel Prices**: Check daily petrol/diesel rates.
    *   **Traffic Updates**: Live city traffic.
    *   **Petrol Stations Near Me**.
6.  **Emergency Services**:
    *   **Police Stations Near Me**.
    *   **Sachet**: Disaster alerts.
7.  **Agriculture**:
    *   **Market Availability**: Mandi prices.
    *   **Check MSP**: Minimum Support Prices.
    *   **Agri Supply Exchange**.
    *   **mKisan**: Farmer advisory.
8.  **Education**:
    *   **Download Marksheet**.
    *   **ABC ID**: Academic Bank of Credit.
    *   **AICTE** & **NTA** services.

**Answering Guidelines:**
*   **Tone**: Helpful, polite, professional, and concise.
*   **Context**: You are *embedded* in the JanSetu website.
*   **Queries**:
    *   If asked "How do I apply for X?", explain the steps or guide them to the relevant section (e.g., "Go to Services > Transport" for Driving Licence).
    *   If asked "Can I apply for a Learner's Licence?", say "Yes, you can apply via the Transport Services section on JanSetu. Look for 'Parivahan' or 'Driving Licence' related services."
    *   If asked about specific doctor appointments, mention "Use the **e-Sanjeevani** service under the **Health** category to book online consultations."
*   **Limitations**: Do not invent schemes or services not listed. If unsure, suggest visiting the "Help & Support" page or "Services" catalog.

**Model Info**: You are powered by Groq (using Llama 3 models).
"""

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not GROQ_AVAILABLE or client is None:
        raise HTTPException(
            status_code=503,
            detail="Chat service is not available. The groq module is not installed or configured."
        )
    
    try:
        # Construct the conversation history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add limited history (last 5 exchanges to keep context but save tokens)
        for msg in request.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": request.message})

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="openai/gpt-oss-120b", 
            temperature=0.7,
            max_tokens=500,
        )

        reply = chat_completion.choices[0].message.content
        return {"response": reply}

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        # Fallback response if API fails (e.g., invalid key or model)
        return {"response": "I'm sorry, I'm currently unable to connect to the AI service. Please check your network or try again later."}

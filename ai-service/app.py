from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import re

# FastAPI uygulaması
app = FastAPI(title="ChatEmo AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basit duygu analizi fonksiyonu
def analyze_sentiment_simple(text):
    """
    Basit kelime tabanlı duygu analizi
    """
    text = text.lower()
    
    # Pozitif kelimeler
    positive_words = [
        'mutlu', 'sevinçli', 'harika', 'güzel', 'iyi', 'mükemmel', 'süper', 
        'harika', 'güzel', 'iyi', 'mükemmel', 'süper', 'çok iyi', 'çok güzel',
        'çok mutlu', 'çok sevinçli', 'çok harika', 'çok süper', 'çok mükemmel',
        'sevindim', 'mutluyum', 'sevinçliyim', 'harikayım', 'güzelim', 'iyiyim',
        'mükemmelim', 'süperim', 'harikayım', 'güzelim', 'iyiyim', 'mükemmelim',
        'süperim', 'çok iyiyim', 'çok güzelim', 'çok mutluyum', 'çok sevinçliyim',
        'çok harikayım', 'çok süperim', 'çok mükemmelim', 'çok güzelim', 'çok iyiyim'
    ]
    
    # Negatif kelimeler
    negative_words = [
        'üzgün', 'kötü', 'berbat', 'korkunç', 'çok kötü', 'çok berbat', 'çok korkunç',
        'üzgünüm', 'kötüyüm', 'berbatım', 'korkunçum', 'çok kötüyüm', 'çok berbatım',
        'çok korkunçum', 'üzgünüm', 'kötüyüm', 'berbatım', 'korkunçum', 'çok kötüyüm',
        'çok berbatım', 'çok korkunçum', 'üzgünüm', 'kötüyüm', 'berbatım', 'korkunçum',
        'çok kötüyüm', 'çok berbatım', 'çok korkunçum', 'üzgünüm', 'kötüyüm', 'berbatım'
    ]
    
    # Kelime sayılarını hesapla
    positive_count = sum(1 for word in positive_words if word in text)
    negative_count = sum(1 for word in negative_words if word in text)
    
    # Duygu belirle
    if positive_count > negative_count:
        confidence = min(0.8 + (positive_count * 0.05), 1.0)  # Max %100
        return "pozitif", confidence
    elif negative_count > positive_count:
        confidence = min(0.8 + (negative_count * 0.05), 1.0)  # Max %100
        return "negatif", confidence
    else:
        return "nötr", 0.5

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    original_label: str

@app.get("/")
async def root():
    return {"message": "ChatEmo AI Service is running!"}

@app.post("/api/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Metni analiz eder ve duygu skorunu döndürür
    """
    try:
        if not request.text or request.text.strip() == "":
            return SentimentResponse(
                sentiment="nötr",
                confidence=0.0,
                original_label="EMPTY"
            )
        
        # Basit duygu analizi yap
        sentiment, confidence = analyze_sentiment_simple(request.text)
        
        return SentimentResponse(
            sentiment=sentiment,
            confidence=round(confidence, 3),
            original_label="SIMPLE_ANALYSIS"
        )
        
    except Exception as e:
        return SentimentResponse(
            sentiment="nötr",
            confidence=0.0,
            original_label=f"ERROR: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import torch

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

# Global model değişkeni
sentiment_pipeline = None

@app.on_event("startup")
async def load_model():
    global sentiment_pipeline
    print("AI Modeli yükleniyor... (savasy/bert-base-turkish-sentiment-cased)")
    try:
        model_name = "savasy/bert-base-turkish-sentiment-cased"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
        print("Model başarıyla yüklendi!")
    except Exception as e:
        print(f"Model yüklenirken hata oluştu: {e}")

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    original_label: str

@app.get("/")
async def root():
    return {"message": "ChatEmo AI Service is running with BERT model!"}

@app.post("/api/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """
    Metni analiz eder ve duygu skorunu döndürür (BERT Modeli ile)
    """
    try:
        if not request.text or request.text.strip() == "":
            return SentimentResponse(
                sentiment="nötr",
                confidence=0.0,
                original_label="EMPTY"
            )
        
        if sentiment_pipeline is None:
            return SentimentResponse(
                sentiment="nötr",
                confidence=0.0,
                original_label="MODEL_NOT_LOADED"
            )

        # Model tahmini
        result = sentiment_pipeline(request.text)[0]
        label = result['label']
        score = result['score']

        # Model çıktısını ön işleme ve NÖTR EŞİĞİ (Threshold)
        # Bu model (savasy/bert-base-turkish-sentiment-cased) binary (pozitif/negatif) çalışıyor.
        # Nötr cümleler için genellikle düşük skor üretir (örn: 0.5 - 0.6 arası).
        # Bu yüzden 0.7 altında kalan skorları 'nötr' olarak kabul edeceğiz.
        
        THRESHOLD = 0.7

        if score < THRESHOLD:
            sentiment = "nötr"
        else:
            if label.lower() in ['positive', 'label_1', 'pos']:
                sentiment = "pozitif"
            elif label.lower() in ['negative', 'label_0', 'neg']:
                sentiment = "negatif"
            else:
                 sentiment = "nötr"
        
        return SentimentResponse(
            sentiment=sentiment,
            confidence=round(score, 3),
            original_label=label
        )
        
    except Exception as e:
        print(f"Hata: {e}")
        return SentimentResponse(
            sentiment="nötr",
            confidence=0.0,
            original_label=f"ERROR: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)

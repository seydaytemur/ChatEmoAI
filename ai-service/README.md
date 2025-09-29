# ChatEmo AI Servisi

Bu servis Hugging Face Spaces'de çalışan duygu analizi API'sidir.

## Özellikler
- Metin tabanlı duygu analizi (Pozitif/Nötr/Negatif)
- CardiffNLP Twitter RoBERTa modeli kullanır
- Gradio web arayüzü
- REST API endpoint

## Kullanım

### Gradio Arayüzü
Hugging Face Spaces'de otomatik olarak çalışır.

### API Endpoint
```
POST /api/analyze
Content-Type: application/json

{
  "text": "Analiz edilecek metin"
}
```

### Response
```json
{
  "sentiment": "pozitif|nötr|negatif",
  "confidence": 0.95,
  "original_label": "LABEL_2"
}
```

## Yerel Çalıştırma
```bash
pip install -r requirements.txt
python app.py
```

## Hugging Face Spaces Deploy
1. Hugging Face Spaces'de yeni Space oluştur
2. SDK: Gradio seç
3. Bu dosyaları yükle
4. Space otomatik olarak çalışacak

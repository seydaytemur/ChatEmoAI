from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

def test_model():
    print("Model yükleniyor... (Bu işlem ilk seferde model indirildiği için uzun sürebilir)")
    try:
        model_name = "savasy/bert-base-turkish-sentiment-cased"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
        print("Model başarıyla yüklendi!")
    except Exception as e:
        print(f"Model yükleme hatası: {e}")
        return

    test_sentences = [
        "Bugün hava çok güzel, kendimi harika hissediyorum.",
        "Bu ürün beş para etmez, sakın almayın.",
        "Toplantı saat 14:00'te yapılacak.",
        "bugün havalı giymişsin",
        "ben bugün hastayım"
    ]

    print("\nTest Sonuçları:")
    print("-" * 50)
    
    print("-" * 50)
    
    THRESHOLD = 0.7

    for sentence in test_sentences:
        result = sentiment_pipeline(sentence)[0]
        label = result['label']
        score = result['score']
        
        predicted_label = label
        if score < THRESHOLD:
            predicted_label = "nötr (Düşük Güven)"
        elif label == "LABEL_1": # Model spesifik düzeltme gerekebilir
             predicted_label = "positive"
        elif label == "LABEL_0":
             predicted_label = "negative"

        print(f"Cümle: {sentence}")
        print(f"Model Çıktısı: {label}, Skor: {score:.4f}")
        print(f"Sonuç: {predicted_label}")
        print("-" * 50)

if __name__ == "__main__":
    test_model()

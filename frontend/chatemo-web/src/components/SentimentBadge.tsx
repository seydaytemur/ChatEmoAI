
export function SentimentBadge({ sentiment, confidence }: { sentiment?: string | null; confidence?: number | null }) {
        const emoji = sentiment === 'pozitif' ? '😊' : sentiment === 'negatif' ? '😞' : '😐'
        const label = sentiment ? sentiment.toUpperCase() : 'ANALİZ BEKLENİYOR'
        const score = confidence != null ? ` %${(confidence * 100).toFixed(0)}` : ''
        return <span className="sentiment">{emoji} {label}{score}</span>
}

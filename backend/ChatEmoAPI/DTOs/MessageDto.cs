namespace ChatEmoAPI.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? Sentiment { get; set; }
        public double? Confidence { get; set; }
        public string Username { get; set; } = string.Empty;
    }

    public class CreateMessageDto
    {
        public string Content { get; set; } = string.Empty;
    }

    public class SentimentAnalysisDto
    {
        public string Sentiment { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}

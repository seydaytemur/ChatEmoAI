using ChatEmoAPI.DTOs;

namespace ChatEmoAPI.Services
{
    public interface ISentimentAnalysisService
    {
        Task<SentimentAnalysisDto?> AnalyzeSentimentAsync(string text);
    }
}

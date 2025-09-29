using ChatEmoAPI.DTOs;
using System.Text.Json;

namespace ChatEmoAPI.Services
{
    public class SentimentAnalysisService : ISentimentAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<SentimentAnalysisService> _logger;
        private readonly string _aiServiceUrl;

        public SentimentAnalysisService(HttpClient httpClient, ILogger<SentimentAnalysisService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _aiServiceUrl = configuration["AIServiceUrl"]
                ?? Environment.GetEnvironmentVariable("AIServiceUrl")
                ?? "http://localhost:7860";
        }

        public async Task<SentimentAnalysisDto?> AnalyzeSentimentAsync(string text)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(text))
                {
                    return new SentimentAnalysisDto
                    {
                        Sentiment = "nötr",
                        Confidence = 0.0
                    };
                }

                // Hugging Face Spaces API endpoint'ine istek gönder
                var requestData = new { text = text };
                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                _logger.LogInformation($"AI servisine istek gönderiliyor: {text}");

                var url = _aiServiceUrl.TrimEnd('/') + "/api/analyze";
                var response = await _httpClient.PostAsync(url, content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"AI servis yanıtı: {responseContent}");

                    var result = JsonSerializer.Deserialize<SentimentAnalysisDto>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    return result;
                }
                else
                {
                    _logger.LogError($"AI servis hatası: {response.StatusCode} - {response.ReasonPhrase}");
                    return new SentimentAnalysisDto
                    {
                        Sentiment = "nötr",
                        Confidence = 0.0
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Duygu analizi sırasında hata oluştu");
                return new SentimentAnalysisDto
                {
                    Sentiment = "nötr",
                    Confidence = 0.0
                };
            }
        }
    }
}

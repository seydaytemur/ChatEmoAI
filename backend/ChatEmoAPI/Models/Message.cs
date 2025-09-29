using System.ComponentModel.DataAnnotations;

namespace ChatEmoAPI.Models
{
    public class Message
    {
        public int Id { get; set; }
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        // Duygu analizi sonuçları
        public string? Sentiment { get; set; } // pozitif, nötr, negatif
        public double? Confidence { get; set; } // 0-1 arası güven skoru
        
        // Foreign Key
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}

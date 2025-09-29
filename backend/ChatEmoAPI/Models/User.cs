using System.ComponentModel.DataAnnotations;

namespace ChatEmoAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}

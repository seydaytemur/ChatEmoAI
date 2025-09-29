using Microsoft.EntityFrameworkCore;

namespace ChatEmoAPI.Models
{
    public class ChatEmoContext : DbContext
    {
        public ChatEmoContext(DbContextOptions<ChatEmoContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User-Message ilişkisi
            modelBuilder.Entity<Message>()
                .HasOne(m => m.User)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index'ler
            modelBuilder.Entity<Message>()
                .HasIndex(m => m.Timestamp);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
        }
    }
}

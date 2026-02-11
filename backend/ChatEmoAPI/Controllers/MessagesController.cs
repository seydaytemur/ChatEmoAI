using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatEmoAPI.Models;
using ChatEmoAPI.DTOs;
using ChatEmoAPI.Services;

namespace ChatEmoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ChatEmoContext _context;
        private readonly ISentimentAnalysisService _sentimentService;
        private readonly ILogger<MessagesController> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        public MessagesController(
            ChatEmoContext context, 
            ISentimentAnalysisService sentimentService,
            ILogger<MessagesController> logger,
            IServiceScopeFactory scopeFactory)
        {
            _context = context;
            _sentimentService = sentimentService;
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages()
        {
            try
            {
                var messages = await _context.Messages
                    .Include(m => m.User)
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new MessageDto
                    {
                        Id = m.Id,
                        Content = m.Content,
                        Timestamp = m.Timestamp,
                        Sentiment = m.Sentiment,
                        Confidence = m.Confidence,
                        Username = m.User.Username
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mesajlar getirilirken hata oluştu");
                return StatusCode(500, "Sunucu hatası");
            }
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(createMessageDto.Content))
                {
                    return BadRequest("Mesaj içeriği boş olamaz");
                }

                // Kullanıcı ID'sini token'dan al
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = int.Parse(userIdClaim.Value);
                var username = User.Identity?.Name ?? "Unknown";

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return Unauthorized("Kullanıcı bulunamadı");
                }

                // Mesajı oluştur
                var message = new Message
                {
                    Content = createMessageDto.Content,
                    UserId = user.Id,
                    Timestamp = DateTime.UtcNow
                };

                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                // Duygu analizi yap (asenkron olarak) - yeni scope ile
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var sentimentResult = await _sentimentService.AnalyzeSentimentAsync(createMessageDto.Content);
                        if (sentimentResult != null)
                        {
                            using var scope = _scopeFactory.CreateScope();
                            var scopedContext = scope.ServiceProvider.GetRequiredService<ChatEmoContext>();
                            var tracked = await scopedContext.Messages.FirstOrDefaultAsync(m => m.Id == message.Id);
                            if (tracked != null)
                            {
                                tracked.Sentiment = sentimentResult.Sentiment;
                                tracked.Confidence = sentimentResult.Confidence;
                                await scopedContext.SaveChangesAsync();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Duygu analizi sırasında hata oluştu");
                    }
                });

                var messageDto = new MessageDto
                {
                    Id = message.Id,
                    Content = message.Content,
                    Timestamp = message.Timestamp,
                    Sentiment = message.Sentiment,
                    Confidence = message.Confidence,
                    Username = user.Username
                };

                return CreatedAtAction(nameof(GetMessages), new { id = message.Id }, messageDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mesaj oluşturulurken hata oluştu");
                return StatusCode(500, "Sunucu hatası");
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsers()
        {
            try
            {
                var usernames = await _context.Users
                    .Select(u => u.Username)
                    .ToListAsync();

                return Ok(usernames);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcılar getirilirken hata oluştu");
                return StatusCode(500, "Sunucu hatası");
            }
        }
    }
}

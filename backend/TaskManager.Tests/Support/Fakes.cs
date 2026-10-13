using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Tests.Support;

public class FakeCurrentUser(int id) : ICurrentUser
{
    public int Id { get; } = id;
}

public class FakeTokenService : ITokenService
{
    public (string Token, DateTime ExpiresAt) Create(User user)
        => ($"token-{user.Id}", DateTime.UtcNow.AddHours(1));
}
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Dtos;
using TaskManager.Api.Exceptions;
using TaskManager.Api.Services;
using TaskManager.Tests.Support;

namespace TaskManager.Tests;

public class AuthServiceTests : IDisposable
{
    private readonly TestDb _testDb = new();
    private readonly AuthService _auth;

    public AuthServiceTests()
    {
        _auth = new AuthService(_testDb.Context, new FakeTokenService());
    }

    public void Dispose() => _testDb.Dispose();

    private static RegisterRequest NewUser(string email = "Michel@Exemplo.com") =>
        new() { Name = "Michel", Email = email, Password = "Senha@1234" };

    [Fact]
    public async Task RegisterAsync_StoresHashedPasswordAndNormalizedEmail()
    {
        var response = await _auth.RegisterAsync(NewUser());

        var user = await _testDb.Context.Users.SingleAsync();
        Assert.Equal("michel@exemplo.com", user.Email);
        Assert.NotEqual("Senha@1234", user.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Senha@1234", user.PasswordHash));
        Assert.False(string.IsNullOrEmpty(response.Token));
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmailIgnoringCase_ThrowsConflictException()
    {
        await _auth.RegisterAsync(NewUser("a@exemplo.com"));

        await Assert.ThrowsAsync<ConflictException>(
            () => _auth.RegisterAsync(NewUser("A@EXEMPLO.COM")));
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsUnauthorizedException()
    {
        await _auth.RegisterAsync(NewUser("a@exemplo.com"));

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _auth.LoginAsync(new LoginRequest { Email = "a@exemplo.com", Password = "errada123" }));
    }

    [Fact]
    public async Task LoginAsync_UnknownEmail_ThrowsSameExceptionAsWrongPassword()
    {
        var ex = await Assert.ThrowsAsync<UnauthorizedException>(
            () => _auth.LoginAsync(new LoginRequest { Email = "nao@existe.com", Password = "qualquer123" }));

        Assert.Equal("E-mail ou senha inválidos.", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsTokenAndUser()
    {
        await _auth.RegisterAsync(NewUser("a@exemplo.com"));

        var response = await _auth.LoginAsync(
            new LoginRequest { Email = " A@exemplo.com ", Password = "Senha@1234" });

        Assert.Equal("a@exemplo.com", response.User.Email);
        Assert.False(string.IsNullOrEmpty(response.Token));
    }
}
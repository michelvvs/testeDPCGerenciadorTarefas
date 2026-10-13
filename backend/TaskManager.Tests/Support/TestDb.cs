using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Tests.Support;

public sealed class TestDb : IDisposable
{
    private readonly SqliteConnection _connection;

    public AppDbContext Context { get; }

    public TestDb()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(_connection).Options;
        Context = new AppDbContext(options);
        Context.Database.EnsureCreated();
    }

    public int AddUser(string email = "teste@exemplo.com")
    {
        var user = new User
        {
            Name = "Teste",
            Email = email,
            PasswordHash = "hash-irrelevante",
            CreatedAt = DateTime.UtcNow
        };
        Context.Users.Add(user);
        Context.SaveChanges();
        return user.Id;
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}
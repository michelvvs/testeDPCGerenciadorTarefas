using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Dtos;
using TaskManager.Api.Exceptions;
using TaskManager.Api.Models;
using TaskManager.Api.Services;
using TaskManager.Tests.Support;

namespace TaskManager.Tests;

public class TaskServiceTests : IDisposable
{
    private readonly TestDb _testDb = new();
    private readonly int _userId;
    private readonly TaskService _service;

    public TaskServiceTests()
    {
        _userId = _testDb.AddUser("a@exemplo.com");
        _service = new TaskService(_testDb.Context, new FakeCurrentUser(_userId));
    }

    public void Dispose() => _testDb.Dispose();

    private TaskService ServiceFor(string email) =>
        new(_testDb.Context, new FakeCurrentUser(_testDb.AddUser(email)));

    [Fact]
    public async Task CreateAsync_ValidRequest_PersistsAsPendingOwnedByCurrentUser()
    {
        var created = await _service.CreateAsync(new CreateTaskRequest { Title = "Estudar EF Core" });

        Assert.True(created.Id > 0);
        Assert.Equal(TaskItemStatus.Pending, created.Status);
        Assert.Equal(_userId, (await _testDb.Context.Tasks.SingleAsync()).UserId);
    }

    [Fact]
    public async Task CreateAsync_DueDateInThePast_ThrowsBusinessRuleException()
    {
        var request = new CreateTaskRequest
        {
            Title = "Tarefa atrasada",
            DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-2))
        };

        await Assert.ThrowsAsync<BusinessRuleException>(() => _service.CreateAsync(request));
    }

    [Fact]
    public async Task UpdateStatusAsync_Done_SetsCompletedAt_AndReopeningClearsIt()
    {
        var created = await _service.CreateAsync(new CreateTaskRequest { Title = "Entregar teste" });

        var done = await _service.UpdateStatusAsync(created.Id, TaskItemStatus.Done);
        Assert.NotNull(done.CompletedAt);

        var reopened = await _service.UpdateStatusAsync(created.Id, TaskItemStatus.Pending);
        Assert.Null(reopened.CompletedAt);
    }

    [Fact]
    public async Task GetByIdAsync_UnknownId_ThrowsNotFoundException()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.GetByIdAsync(9999));
    }

    [Fact]
    public async Task GetByIdAsync_TaskOfAnotherUser_ThrowsNotFoundException()
    {
        var created = await _service.CreateAsync(new CreateTaskRequest { Title = "Privada" });

        await Assert.ThrowsAsync<NotFoundException>(
            () => ServiceFor("b@exemplo.com").GetByIdAsync(created.Id));
    }

    [Fact]
    public async Task DeleteAsync_TaskOfAnotherUser_ThrowsAndKeepsTheTask()
    {
        var created = await _service.CreateAsync(new CreateTaskRequest { Title = "Não apagar" });

        await Assert.ThrowsAsync<NotFoundException>(
            () => ServiceFor("b@exemplo.com").DeleteAsync(created.Id));

        Assert.Equal(1, await _testDb.Context.Tasks.CountAsync());
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyTasksOfTheCurrentUser()
    {
        await _service.CreateAsync(new CreateTaskRequest { Title = "Minha" });
        var other = ServiceFor("b@exemplo.com");
        await other.CreateAsync(new CreateTaskRequest { Title = "Do outro" });

        var mine = await _service.GetAllAsync(new TaskQuery());

        Assert.Single(mine.Items);
        Assert.Equal("Minha", mine.Items[0].Title);
    }

    [Fact]
    public async Task GetAllAsync_FilterByStatusAndSearch_ReturnsOnlyMatches()
    {
        var readme = await _service.CreateAsync(new CreateTaskRequest { Title = "Escrever README" });
        await _service.CreateAsync(new CreateTaskRequest { Title = "Configurar Docker" });
        await _service.UpdateStatusAsync(readme.Id, TaskItemStatus.Done);

        var result = await _service.GetAllAsync(
            new TaskQuery { Status = TaskItemStatus.Done, Search = "readme" });

        Assert.Single(result.Items);
        Assert.Equal(1, result.TotalItems);
    }

    [Fact]
    public async Task GetAllAsync_Pagination_RespectsPageSize()
    {
        for (var i = 1; i <= 5; i++)
            await _service.CreateAsync(new CreateTaskRequest { Title = $"Tarefa {i}" });

        var page2 = await _service.GetAllAsync(new TaskQuery { Page = 2, PageSize = 2 });

        Assert.Equal(2, page2.Items.Count);
        Assert.Equal(5, page2.TotalItems);
        Assert.Equal(3, page2.TotalPages);
    }

    [Fact]
    public async Task GetSummaryAsync_CountsOnlyTheCurrentUser()
    {
        var a = await _service.CreateAsync(new CreateTaskRequest { Title = "A1" });
        await _service.CreateAsync(new CreateTaskRequest { Title = "A2" });
        await _service.UpdateStatusAsync(a.Id, TaskItemStatus.InProgress);
        await ServiceFor("b@exemplo.com").CreateAsync(new CreateTaskRequest { Title = "B1" });

        var summary = await _service.GetSummaryAsync();

        Assert.Equal(1, summary.Pending);
        Assert.Equal(1, summary.InProgress);
        Assert.Equal(2, summary.Total);
    }
}
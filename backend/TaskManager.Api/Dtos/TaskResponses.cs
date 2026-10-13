using TaskManager.Api.Models;

namespace TaskManager.Api.Dtos;

public record TaskResponse(
    int Id,
    string Title,
    string? Description,
    TaskItemStatus Status,
    TaskPriority Priority,
    DateOnly? DueDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? CompletedAt)
{
    public static TaskResponse FromEntity(TaskItem t) => new(
        t.Id, t.Title, t.Description, t.Status, t.Priority,
        t.DueDate, t.CreatedAt, t.UpdatedAt, t.CompletedAt);
}

public record PagedResult<T>(IReadOnlyList<T> Items, int TotalItems, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
}

public record TaskSummaryResponse(int Pending, int InProgress, int Done, int Total);
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Dtos;
using TaskManager.Api.Exceptions;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services;

public class TaskService(AppDbContext db, ICurrentUser currentUser) : ITaskService
{
    public async Task<PagedResult<TaskResponse>> GetAllAsync(TaskQuery query, CancellationToken ct = default)
    {
        
        IQueryable<TaskItem> tasks = UserTasks().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim().ToLower();
            tasks = tasks.Where(t =>
                t.Title.ToLower().Contains(term) ||
                (t.Description != null && t.Description.ToLower().Contains(term)));
        }

        if (query.Status.HasValue)
            tasks = tasks.Where(t => t.Status == query.Status.Value);

        if (query.Priority.HasValue)
            tasks = tasks.Where(t => t.Priority == query.Priority.Value);

        var total = await tasks.CountAsync(ct);

        var items = await tasks
            .OrderByDescending(t => t.CreatedAt)
            .ThenByDescending(t => t.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return new PagedResult<TaskResponse>(
            items.Select(TaskResponse.FromEntity).ToList(), total, query.Page, query.PageSize);
    }

    public async Task<TaskSummaryResponse> GetSummaryAsync(CancellationToken ct = default)
    {
        var counts = await UserTasks().AsNoTracking()
            .GroupBy(t => t.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        int Of(TaskItemStatus s) => counts.FirstOrDefault(c => c.Status == s)?.Count ?? 0;

        var pending = Of(TaskItemStatus.Pending);
        var inProgress = Of(TaskItemStatus.InProgress);
        var done = Of(TaskItemStatus.Done);

        return new TaskSummaryResponse(pending, inProgress, done, pending + inProgress + done);
    }

    public async Task<TaskResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await UserTasks().AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, ct)
                     ?? throw new NotFoundException($"Tarefa {id} não encontrada.");

        return TaskResponse.FromEntity(entity);
    }

    public async Task<TaskResponse> CreateAsync(CreateTaskRequest request, CancellationToken ct = default)
    {
        EnsureDueDateIsNotInThePast(request.DueDate);

        var now = DateTime.UtcNow;
        var entity = new TaskItem
        {
            UserId = currentUser.Id,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Priority = request.Priority,
            DueDate = request.DueDate,
            Status = TaskItemStatus.Pending,
            CreatedAt = now,
            UpdatedAt = now
        };

        db.Tasks.Add(entity);
        await db.SaveChangesAsync(ct);

        return TaskResponse.FromEntity(entity);
    }

    public async Task<TaskResponse> UpdateAsync(int id, UpdateTaskRequest request, CancellationToken ct = default)
    {
        var entity = await FindOrThrowAsync(id, ct);

        if (request.DueDate != entity.DueDate)
            EnsureDueDateIsNotInThePast(request.DueDate);

        entity.Title = request.Title.Trim();
        entity.Description = request.Description?.Trim();
        entity.Priority = request.Priority;
        entity.DueDate = request.DueDate;
        ApplyStatus(entity, request.Status);
        entity.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return TaskResponse.FromEntity(entity);
    }

    public async Task<TaskResponse> UpdateStatusAsync(int id, TaskItemStatus status, CancellationToken ct = default)
    {
        var entity = await FindOrThrowAsync(id, ct);

        ApplyStatus(entity, status);
        entity.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return TaskResponse.FromEntity(entity);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var entity = await FindOrThrowAsync(id, ct);

        db.Tasks.Remove(entity);
        await db.SaveChangesAsync(ct);
    }

    // ---------- privates ----------
    private IQueryable<TaskItem> UserTasks()
    {
        var userId = currentUser.Id;
        return db.Tasks.Where(t => t.UserId == userId);
    }   
    private async Task<TaskItem> FindOrThrowAsync(int id, CancellationToken ct) =>
        await UserTasks().FirstOrDefaultAsync(t => t.Id == id, ct)
        ?? throw new NotFoundException($"Tarefa {id} não encontrada.");

    private static void ApplyStatus(TaskItem entity, TaskItemStatus newStatus)
    {
        if (entity.Status == newStatus) return;

        entity.Status = newStatus;
        entity.CompletedAt = newStatus == TaskItemStatus.Done ? DateTime.UtcNow : null;
    }

    private static void EnsureDueDateIsNotInThePast(DateOnly? dueDate)
    {
        if (dueDate.HasValue && dueDate.Value < DateOnly.FromDateTime(DateTime.UtcNow))
            throw new BusinessRuleException("A data limite não pode estar no passado.");
    }
}
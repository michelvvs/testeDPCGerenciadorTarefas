using TaskManager.Api.Dtos;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services;

public interface ITaskService
{
    Task<PagedResult<TaskResponse>> GetAllAsync(TaskQuery query, CancellationToken ct = default);
    Task<TaskSummaryResponse> GetSummaryAsync(CancellationToken ct = default);
    Task<TaskResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<TaskResponse> CreateAsync(CreateTaskRequest request, CancellationToken ct = default);
    Task<TaskResponse> UpdateAsync(int id, UpdateTaskRequest request, CancellationToken ct = default);
    Task<TaskResponse> UpdateStatusAsync(int id, TaskItemStatus status, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
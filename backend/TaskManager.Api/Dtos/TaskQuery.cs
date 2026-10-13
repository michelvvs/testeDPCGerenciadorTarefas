using System.ComponentModel.DataAnnotations;
using TaskManager.Api.Models;

namespace TaskManager.Api.Dtos;

public class TaskQuery
{
    public string? Search { get; set; }
    public TaskItemStatus? Status { get; set; }
    public TaskPriority? Priority { get; set; }

    [Range(1, 10000)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;
}
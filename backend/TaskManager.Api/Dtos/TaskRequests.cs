using System.ComponentModel.DataAnnotations;
using TaskManager.Api.Models;

namespace TaskManager.Api.Dtos;

public class CreateTaskRequest
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(120, MinimumLength = 3, ErrorMessage = "O título deve ter entre 3 e 120 caracteres.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "A descrição deve ter no máximo 1000 caracteres.")]
    public string? Description { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public DateOnly? DueDate { get; set; }
}

public class UpdateTaskRequest : CreateTaskRequest
{
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;
}

public class UpdateStatusRequest
{
    public required TaskItemStatus Status { get; set; }
}
namespace TaskManager.Api.Exceptions;

/// <summary>Recurso inexistente → HTTP 404.</summary>
public class NotFoundException(string message) : Exception(message)
{
}

/// <summary>Regra de negócio violada → HTTP 422.</summary>
public class BusinessRuleException(string message) : Exception(message)
{
}
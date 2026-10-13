namespace TaskManager.Api.Exceptions;

/// <summary>Recurso inexistente → HTTP 404.</summary>
public class NotFoundException(string message) : Exception(message)
{
}

/// <summary>Regra de negócio violada → HTTP 422.</summary>
public class BusinessRuleException(string message) : Exception(message)
{
}

/// <summary>Credenciais inválidas ou usuário não autenticado → HTTP 401.</summary>
public class UnauthorizedException(string message) : Exception(message)
{
}

/// <summary>Conflito de estado (ex.: e-mail já cadastrado) → HTTP 409.</summary>
public class ConflictException(string message) : Exception(message)
{
}

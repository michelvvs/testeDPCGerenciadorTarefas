using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TaskManager.Api.Exceptions;

namespace TaskManager.Api.Services;

public interface ICurrentUser
{
    int Id { get; }
}

public class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    public int Id
    {
        get
        {
            var principal = accessor.HttpContext?.User;
            var value = principal?.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? principal?.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return int.TryParse(value, out var id)
                ? id
                : throw new UnauthorizedException("Usuário não autenticado.");
        }
    }
}
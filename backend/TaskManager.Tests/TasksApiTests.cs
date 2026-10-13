using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace TaskManager.Tests;

public class TasksApiTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@exemplo.com";

        var response = await client.PostAsJsonAsync("/api/auth/register",
            new { name = "Teste", email, password = "Senha@1234" });
        response.EnsureSuccessStatusCode();

        var auth = await response.Content.ReadFromJsonAsync<JsonElement>();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth.GetProperty("token").GetString());
        return client;
    }

    private static async Task<int> CreateTaskAsync(HttpClient client, string title)
    {
        var response = await client.PostAsJsonAsync("/api/tasks", new { title, priority = "High" });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        return body.GetProperty("id").GetInt32();
    }

    [Fact]
    public async Task Get_WithoutToken_Returns401()
    {
        var response = await factory.CreateClient().GetAsync("/api/tasks");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        var client = factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@exemplo.com";
        await client.PostAsJsonAsync("/api/auth/register",
            new { name = "Teste", email, password = "Senha@1234" });

        var response = await client.PostAsJsonAsync("/api/auth/login",
            new { email, password = "errada123" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Post_ValidTask_Returns201WithLocation_AndAppearsInTheList()
    {
        var client = await CreateAuthenticatedClientAsync();

        var response = await client.PostAsJsonAsync("/api/tasks", new { title = "Escrever testes" });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);

        var list = await client.GetFromJsonAsync<JsonElement>("/api/tasks");
        Assert.Equal(1, list.GetProperty("totalItems").GetInt32());
    }

    [Fact]
    public async Task Post_WithoutTitle_Returns400()
    {
        var client = await CreateAuthenticatedClientAsync();

        var response = await client.PostAsJsonAsync("/api/tasks", new { description = "sem título" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Patch_StatusToDone_SetsCompletedAt()
    {
        var client = await CreateAuthenticatedClientAsync();
        var id = await CreateTaskAsync(client, "Concluir");

        var response = await client.PatchAsJsonAsync($"/api/tasks/{id}/status", new { status = "Done" });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Done", body.GetProperty("status").GetString());
        Assert.NotEqual(JsonValueKind.Null, body.GetProperty("completedAt").ValueKind);
    }

    [Fact]
    public async Task Users_DoNotSeeEachOthersTasks_AndGet404()
    {
        var alice = await CreateAuthenticatedClientAsync();
        var bob = await CreateAuthenticatedClientAsync();
        var id = await CreateTaskAsync(alice, "Só da Alice");

        Assert.Equal(HttpStatusCode.OK, (await alice.GetAsync($"/api/tasks/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await bob.GetAsync($"/api/tasks/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await bob.DeleteAsync($"/api/tasks/{id}")).StatusCode);
    }
}
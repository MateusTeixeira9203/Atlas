---
name: dotnet-patterns
description: Idiomatic C# and .NET patterns for robust applications. Covers immutability with records, async/await with cancellation tokens, dependency injection, EF Core repository patterns, Result type, ASP.NET Core middleware, and common anti-patterns.
cpe:
  source: ecc
  original_path: skills/dotnet-patterns/SKILL.md
  original_url: https://github.com/affaan-m/ECC/blob/main/skills/dotnet-patterns/SKILL.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# .NET Patterns

Idiomatic C# and .NET patterns for building robust applications.

## When to Activate

- Writing or reviewing C#/.NET code
- Designing APIs with ASP.NET Core
- Working with EF Core and database access
- Setting up dependency injection
- Reviewing async/await patterns

## Immutability First

```csharp
// Use records for immutable data
public record UserDto(Guid Id, string Email, string DisplayName);

// init-only properties for settable-once values
public class OrderItem
{
    public required Guid ProductId { get; init; }
    public required int Quantity { get; init; }
}
```

## Async/Await

```csharp
// Always propagate CancellationToken
public async Task<User?> GetUserAsync(Guid id, CancellationToken ct = default)
{
    return await _db.Users.FindAsync(new object[] { id }, ct);
}

// Never block on async (deadlock risk)
// BAD:  user = GetUserAsync(id).Result;
// GOOD: user = await GetUserAsync(id);

// Use ConfigureAwait(false) in library code
var data = await _httpClient.GetStringAsync(url).ConfigureAwait(false);
```

## Dependency Injection

```csharp
// Interface-based abstraction
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct);
    Task SaveAsync(User user, CancellationToken ct);
}

// Registration
builder.Services.AddScoped<IUserRepository, EfUserRepository>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
```

## Result Pattern

```csharp
public record Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Value { get; init; }
    public string? Error { get; init; }

    public static Result<T> Ok(T value) => new() { IsSuccess = true, Value = value };
    public static Result<T> Fail(string error) => new() { IsSuccess = false, Error = error };
}
```

## Anti-Patterns

```csharp
// BAD: async void (exceptions are unobservable)
public async void OnButtonClick() { await DoWorkAsync(); }

// GOOD: async Task
public async Task OnButtonClickAsync() { await DoWorkAsync(); }

// BAD: blocking on async
var result = GetDataAsync().Result;           // Deadlock risk

// BAD: catching all exceptions silently
try { ... } catch { }                         // Swallows real errors
```

---
*Stub — conteúdo normalizado pelo Atlas. Verificar e substituir pelo SKILL.md original do ECC após rate limit.*

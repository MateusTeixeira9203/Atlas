---
name: kotlin-test
description: Run Kotlin/Android tests, analyze failures, and improve coverage. Supports JUnit, MockK, Kotest, and Android instrumentation tests. Targets 80%+ coverage with JaCoCo.
cpe:
  source: ecc
  original_path: commands/kotlin-test.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# /kotlin-test

Run Kotlin tests, analyze failures, and improve coverage.

## Process

```bash
./gradlew test                    # Unit tests
./gradlew connectedAndroidTest    # Instrumentation tests (requires device/emulator)
./gradlew jacocoTestReport        # Coverage report
```

## Test Patterns

```kotlin
// JUnit 5 + MockK
@ExtendWith(MockKExtension::class)
class UserServiceTest {

    @MockK
    private lateinit var repository: UserRepository

    @InjectMockKs
    private lateinit var service: UserService

    @Test
    fun `should return user when exists`() {
        every { repository.findById("1") } returns User("1", "Alice")
        val result = service.getUser("1")
        assertThat(result.name).isEqualTo("Alice")
    }

    @Test
    fun `should throw when user not found`() {
        every { repository.findById("99") } returns null
        assertThrows<UserNotFoundException> { service.getUser("99") }
    }
}
```

```kotlin
// Coroutine test
@Test
fun `test async operation`() = runTest {
    val result = service.fetchAsync()
    assertThat(result).isNotNull()
}
```

## Coverage Report

```
Module: app
─────────────────────────────────────
Class                        Coverage
UserService                  91%
AuthRepository               78%   ← below threshold
OrderViewModel               65%   ← below threshold
─────────────────────────────────────
Overall                      81% ✓
```

Generate and open: `./gradlew jacocoTestReport && open build/reports/jacoco/index.html`

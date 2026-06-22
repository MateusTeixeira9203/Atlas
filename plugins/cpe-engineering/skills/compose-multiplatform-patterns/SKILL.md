---
name: compose-multiplatform-patterns
description: Guidance for shared UI across Android, iOS, Desktop, and Web using Compose Multiplatform. Covers state management (StateFlow + ViewModel), type-safe navigation, expect/actual declarations, theming with Material 3, and composable performance optimization.
cpe:
  source: ecc
  original_path: skills/compose-multiplatform-patterns/SKILL.md
  original_url: https://github.com/affaan-m/ECC/blob/main/skills/compose-multiplatform-patterns/SKILL.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — caminho não confirmado no ECC; aguarda re-fetch após rate limit
  status: stub
---

# Compose Multiplatform Patterns

Guidance for constructing shared UI across Android, iOS, Desktop, and Web platforms using Compose technologies.

## When to Activate

- Building or reviewing Compose Multiplatform (KMP) projects
- Managing shared UI state across platforms
- Setting up navigation in Compose Multiplatform
- Optimizing composable performance
- Implementing platform-specific UI with expect/actual

## State Management

Use a single data class for screen state. Expose it as `StateFlow` from a ViewModel.

```kotlin
data class HomeUiState(
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
}
```

For event handling, use a sealed class and a single `onEvent(event: HomeEvent)` function rather than multiple individual callbacks.

## Navigation

Use type-safe routing with `@Serializable` objects (Compose Navigation 2.8+):

```kotlin
@Serializable
object HomeRoute

@Serializable
data class DetailRoute(val id: String)

NavHost(navController, startDestination = HomeRoute) {
    composable<HomeRoute> { HomeScreen() }
    composable<DetailRoute> { backStackEntry ->
        val route: DetailRoute = backStackEntry.toRoute()
        DetailScreen(id = route.id)
    }
}
```

## Composable Design

- Use slot-based APIs for flexible component composition.
- Maintain correct modifier ordering: layout → shape → drawing → interaction.
- Mark stable types with `@Stable` or `@Immutable` to reduce unnecessary recompositions.
- Use `derivedStateOf` for computed state that depends on other state.

## Cross-Platform UI

```kotlin
// shared/src/commonMain/...
expect fun PlatformButton(text: String, onClick: () -> Unit)

// shared/src/androidMain/...
actual fun PlatformButton(text: String, onClick: () -> Unit) {
    Button(onClick = onClick) { Text(text) }
}

// shared/src/iosMain/...
actual fun PlatformButton(text: String, onClick: () -> Unit) {
    // UIKit-based implementation
}
```

## Performance

- Use `key` in lazy lists to help the runtime track item identity.
- Avoid heavy computations in `build()` — move them to `remember { }` or `LaunchedEffect`.
- Minimize allocations inside composables.

---
*Stub — conteúdo normalizado pelo CPE. Verificar e substituir pelo SKILL.md original do ECC após rate limit.*

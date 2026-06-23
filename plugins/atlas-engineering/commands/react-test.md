---
name: react-test
description: Run React/Next.js tests with Jest or Vitest. Analyze failures, fix broken tests, and improve coverage. Supports React Testing Library and Playwright for E2E.
cpe:
  source: ecc
  original_path: commands/react-test.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# /react-test

Run React tests, analyze failures, and improve coverage.

## Process

```bash
# Unit + integration
npm test -- --coverage --watchAll=false

# E2E
npx playwright test
```

## Test Patterns

```typescript
// React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

it('submits the form with valid data', async () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@test.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@test.com' });
});

// Testing async state
it('shows loading then data', async () => {
    render(<UserProfile id="1" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await screen.findByText('Alice');  // waits for async
});
```

## Common Failures

| Failure | Fix |
|---------|-----|
| `act()` warning | Wrap state updates: `await act(async () => { ... })` |
| `Cannot read properties of null` | Check mock is set up before render |
| Component not found | Use `screen.debug()` to see what's rendered |
| Async test timeout | Increase timeout or use `findBy*` instead of `getBy*` |

## Coverage

```bash
npm test -- --coverage --coverageReporters=text
```

Target: 80%+ on all source files (exclude `*.stories.tsx`, `*.d.ts`).

## Report

```
React Test Summary
───────────────────
Tests: 43 passing, 0 failing
Coverage: 81% ✓
E2E: 5/5 scenarios passing
```

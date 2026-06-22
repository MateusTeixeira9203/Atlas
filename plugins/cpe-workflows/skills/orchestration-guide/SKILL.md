---
name: orchestration-guide
description: Multi-agent coordination patterns for Claude Code. Covers memory-first workflow, agent topology selection (pipeline/fan-out/supervisor), SendMessage coordination, parallel spawning, and anti-drift verification gates. Synthesized from ruflo orchestration architecture (MIT).
cpe:
  source: ruflo
  original_path: AGENTS.md + CLAUDE.md
  original_url: https://github.com/ruvnet/ruflo
  source_commit: 9c28fe03
  license: MIT
  integrated_at: 2026-06-22
  adaptation: >
    Padrões de orquestração extraídos do ruflo e normalizados para uso com Claude
    Agent SDK. Sem dependência de claude-flow CLI ou ruflo runtime.
    Terminologia adaptada para o CPE.
---

# Orchestration Guide

Multi-agent coordination patterns for Claude Code. Use when spawning 2+ agents that must work together.

## When to Activate

Use when: "coordinate agents", "multi-agent", "spawn agents", "swarm", "parallel agents", "delegate to agents"

## Core Principle

**Memory-first, then execute.** Before any multi-agent task:
1. Search memory for prior patterns on this type of task
2. Initialize coordination (one message)
3. Immediately execute — don't wait for acknowledgments

## Memory-First Protocol

```
Before starting: search memory for relevant patterns
  → If match (relevance > 0.7): apply the pattern, adapt as needed
  → If no match: proceed fresh, store successful pattern after completion

After completion: store the successful approach
  key: "<task-category>-<technology>"
  value: "what worked, what to avoid"
```

## Agent Topology Selection

Choose the topology that matches the work structure:

### Pipeline (A → B → C)
Sequential processing where each agent's output is the next agent's input.

```
Use for: file → transformation → validation → delivery
Example: code generation → review → fix → commit

Spawn order: A first, B waits for A's message, C waits for B's
Coordination: via SendMessage("<agent-name>", result)
```

### Fan-Out / Fan-In
One coordinator spawns N independent workers, then collects results.

```
Use for: parallel research, multi-file analysis, test generation across modules

coordinator spawns in ONE message (run_in_background: true for all):
  worker-1 (files: src/auth/)
  worker-2 (files: src/api/)
  worker-3 (files: src/ui/)
  
Each worker: SendMessage("coordinator", findings)
Coordinator: waits for all N messages, synthesizes
Max concurrent: 5 (beyond this, diminishing returns)
```

### Supervisor / Worker
A supervisor manages the task queue, workers pull from it.

```
Use for: large tasks with many independent subtasks

supervisor:
  - decomposes task into subtask queue
  - assigns subtasks to available workers
  - tracks completion, handles failures
  - synthesizes final result

workers:
  - claim one subtask at a time
  - report completion or failure to supervisor
  - never assume another worker's state
```

## Spawning Patterns

### Always spawn in one message

```
✓ One message, all agents, all run_in_background: true
✗ Multiple messages, one agent each (sequential, defeats parallelism)
```

### Agent assignment by specialization

| Task | Agent type |
|------|-----------|
| Code review | code-reviewer |
| Security audit | security-reviewer |
| Architecture | architect |
| Test generation | tdd-guide |
| Research | spec-miner |
| Orchestration | swarm-coordinator |
| Goal planning | goal-planner |

### Named agents communicate via SendMessage

```
Agent-A completes its work, sends to Agent-B:
  SendMessage("Agent-B", { status: "complete", result: "...", handoff: "..." })

Never poll. Never wait with sleep. React to messages.
```

## Three-Tier Model Routing

Route tasks to models by complexity to control cost:

```
Tier 1 — Haiku (~$0.0002): deterministic operations
  - file renaming, formatting, simple transforms
  - searching/indexing
  - status reporting

Tier 2 — Sonnet (~$0.003): standard development work
  - code generation, bug fixes
  - test writing
  - documentation

Tier 3 — Opus (~$0.015): complex reasoning
  - architecture decisions
  - security review
  - cross-system design
  - ambiguous requirements resolution
```

## Anti-Drift Protocol

Long-running multi-agent sessions can drift — agents forget context, contradict each other, repeat work.

**Verification gate every 2 checkpoints:**
```
1. Each agent reports current state summary
2. Coordinator checks for contradictions / repeated work
3. If drift detected: pause, reconcile, re-brief affected agents
4. Continue
```

**Escalation triggers (from loop-operator agent):**
- No progress across 2 checkpoints
- Same failure pattern repeating
- Budget exceeded
- Merge conflicts between agent outputs

## Communication Rules

```
✓ Use SendMessage for agent-to-agent handoffs
✓ Include status, result, and explicit handoff instructions
✓ Spawn all agents in one message with run_in_background: true
✓ Coordinator synthesizes — never let workers write final output independently

✗ Don't poll agents (no sleep loops)
✗ Don't spawn more than 5 concurrent agents
✗ Don't let agents overwrite each other's outputs without a merge step
✗ Don't skip the memory-search step at the start
```

## Worked Example: Code Review Swarm

```
Goal: review a large PR across 3 concern areas

Spawn in ONE message:
  Agent-1 (code-reviewer): "Review src/auth/ for security and quality"
  Agent-2 (security-reviewer): "Review entire PR for OWASP vulnerabilities"
  Agent-3 (architect): "Review PR for architectural soundness"
  
All run_in_background: true

Each agent: SendMessage("coordinator", { area, findings, severity[] })
Coordinator receives 3 messages, synthesizes:
  - Deduplicate findings across agents
  - Rank by severity
  - Generate unified review report
  - Verdict: APPROVE / WARN / BLOCK
```

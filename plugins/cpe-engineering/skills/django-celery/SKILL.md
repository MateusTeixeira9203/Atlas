---
name: django-celery
description: Production-grade background task processing in Django with Celery. Covers task design, idempotency, periodic scheduling with Beat, retry with exponential backoff, canvas workflows (chain/group/chord), and monitoring with Flower.
cpe:
  source: ecc
  original_path: skills/django-celery/SKILL.md
  original_url: https://github.com/affaan-m/ECC/blob/main/skills/django-celery/SKILL.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# Django Celery Patterns

Production-grade background task processing in Django using Celery with Redis or RabbitMQ.

## When to Activate

- Adding background tasks or job queues to a Django project
- Setting up periodic/scheduled tasks with Celery Beat
- Designing retry strategies for unreliable operations
- Building canvas workflows (chain, group, chord)
- Monitoring task queues in production

## Basic Task

```python
from celery import shared_task

@shared_task(bind=True, max_retries=3)
def send_welcome_email(self, user_id: int):
    try:
        user = User.objects.get(id=user_id)
        send_email(user.email, subject="Welcome!")
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```

## Idempotent Tasks

Design tasks so that running them twice produces the same result:

```python
@shared_task
def sync_invoice(invoice_id: int):
    invoice = Invoice.objects.get(id=invoice_id)
    if invoice.synced:
        return  # Already done — safe to skip
    # ... sync logic
    invoice.synced = True
    invoice.save()
```

## Periodic Tasks (Beat)

```python
# settings.py
CELERY_BEAT_SCHEDULE = {
    "daily-report": {
        "task": "app.tasks.generate_daily_report",
        "schedule": crontab(hour=0, minute=0),
    },
}
```

## Canvas Workflows

```python
from celery import chain, group, chord

# Chain: step1 → step2 → step3
result = chain(validate.s(data), process.s(), notify.s())()

# Group: run in parallel
result = group(process.s(item) for item in items)()

# Chord: parallel + callback when all done
result = chord(group(fetch.s(url) for url in urls))(aggregate.s())
```

## Resilience Patterns

```python
@shared_task(
    bind=True,
    acks_late=True,              # Ack only after successful execution
    max_retries=5,
    default_retry_delay=60,
    soft_time_limit=300,         # Raises SoftTimeLimitExceeded
    time_limit=360,              # Hard kill
)
def reliable_task(self, payload):
    ...
```

## Monitoring

```bash
# Inspect active workers
celery -A myproject inspect active

# Start Flower dashboard (port 5555)
celery -A myproject flower
```

---
*Stub — conteúdo normalizado pelo CPE. Verificar e substituir pelo SKILL.md original do ECC após rate limit.*

---
name: jpa-patterns
description: JPA and Hibernate patterns for Spring Boot applications. Covers entity design with auditing, lazy loading, N+1 prevention via JOIN FETCH, projections, pagination, and performance tuning with HikariCP and second-level caching.
cpe:
  source: ecc
  original_path: skills/jpa-patterns/SKILL.md
  original_url: https://github.com/affaan-m/ECC/blob/main/skills/jpa-patterns/SKILL.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# JPA Patterns

Data modeling, repositories, and performance optimization in Spring Boot using JPA and Hibernate.

## When to Activate

- Designing or reviewing JPA entities and relationships
- Diagnosing N+1 query problems
- Configuring Hibernate performance (pooling, caching)
- Writing custom JPQL/native queries
- Setting up database migrations for JPA schema

## Entity Design

```java
@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)   // Lazy by default
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

## N+1 Prevention

```java
// BAD: Triggers N+1 — one query per order to load customer
List<Order> orders = orderRepository.findAll();
orders.forEach(o -> System.out.println(o.getCustomer().getName()));

// GOOD: Single JOIN FETCH query
@Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.status = :status")
List<Order> findByStatusWithCustomer(@Param("status") String status);
```

## Projections for Read-Only Views

```java
// Interface projection — select only needed columns
public interface OrderSummary {
    Long getId();
    String getStatus();
    String getCustomerName();   // Customer.name via getter naming
}

List<OrderSummary> summaries = orderRepo.findByStatus("PAID", OrderSummary.class);
```

## Transactions

```java
@Transactional(readOnly = true)    // readOnly skips dirty-checking flush
public List<OrderSummary> listActive() { ... }

@Transactional                     // write operations need full transaction
public Order create(CreateOrderCmd cmd) { ... }
```

## Performance Tuning

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
  jpa:
    properties:
      hibernate:
        jdbc.batch_size: 50
        order_inserts: true
        order_updates: true
```

## Schema Migration

Use Flyway or Liquibase — never rely on `spring.jpa.hibernate.ddl-auto=update` in production.

---
*Stub — conteúdo normalizado pelo Atlas. Verificar e substituir pelo SKILL.md original do ECC após rate limit.*

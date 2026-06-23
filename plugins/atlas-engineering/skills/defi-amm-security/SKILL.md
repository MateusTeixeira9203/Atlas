---
name: defi-amm-security
description: Security checklist and patterns for Solidity AMM contracts and liquidity pools. Covers reentrancy, CEI ordering, donation attacks, oracle manipulation (spot vs TWAP), slippage protection, and automated auditing with Slither/Echidna/Foundry.
cpe:
  source: ecc
  original_path: skills/defi-amm-security/SKILL.md
  original_url: https://github.com/affaan-m/ECC/blob/main/skills/defi-amm-security/SKILL.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo Atlas
  status: stub
---

# DeFi AMM Security

Security checklist and patterns for Solidity AMM contracts, liquidity pools, and swap functions.

## When to Activate

- Auditing or writing Solidity AMM contracts
- Reviewing liquidity pool or swap implementations
- Setting up automated security tooling (Slither, Echidna, Foundry)
- Checking for common DeFi vulnerabilities

## Critical Vulnerability Checklist

### Reentrancy
```solidity
// BAD: state change after external call
function withdraw(uint amount) external {
    (bool ok,) = msg.sender.call{value: amount}("");  // external call first
    balances[msg.sender] -= amount;                    // state change after — reentrancy!
}

// GOOD: CEI (Checks-Effects-Interactions)
function withdraw(uint amount) external nonReentrant {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;    // effect first
    (bool ok,) = msg.sender.call{value: amount}("");   // interaction last
}
```

### Donation Attacks (balanceOf manipulation)
```solidity
// BAD: relies on balanceOf
uint reserve = IERC20(token).balanceOf(address(this));

// GOOD: track internal accounting
uint reserve = _internalReserve;   // updated only via deposit/withdraw
```

### Oracle Manipulation (Spot vs TWAP)
```solidity
// BAD: spot price — manipulatable in same block
uint price = pool.getSpotPrice(tokenA, tokenB);

// GOOD: TWAP — averaged over time
uint price = oracle.getTWAP(tokenA, tokenB, 30 minutes);
```

### Slippage and Expiry
```solidity
function swap(uint amountIn, uint minAmountOut, uint deadline) external {
    require(block.timestamp <= deadline, "expired");
    uint out = _calculateOutput(amountIn);
    require(out >= minAmountOut, "slippage");
    // execute swap
}
```

### Safe Math for Reserve Calculations
```solidity
// Use FullMath.mulDiv() from Uniswap for 512-bit intermediate precision
uint price = FullMath.mulDiv(reserve1, Q96, reserve0);
```

## Automated Auditing

```bash
# Static analysis
slither contracts/Pool.sol

# Fuzz testing
echidna contracts/Pool.sol --contract TestPool

# Property-based tests
forge test --fuzz-runs 10000
```

## Access Controls

```solidity
// Use Ownable2Step for admin functions (prevents accidental renounce)
contract Pool is Ownable2Step {
    function setFee(uint newFee) external onlyOwner { ... }
}
```

---
*Stub — conteúdo normalizado pelo Atlas. Verificar e substituir pelo SKILL.md original do ECC após rate limit.*

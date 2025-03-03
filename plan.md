### Step 1: Initialize Game Session & Welcome Frame
```text
- Build: POST /api/start endpoint that creates GameState with level=0 and totalPrize=0. Create welcome frame with start button using Frame v2 components.
- Outcome: Users see "Ready to become a billionaire?" with functional start button. Session ID appears in Redis with TTL.
```

### Step 2: Basic Question Frame Delivery
```text
- Build: POST /api/question/1 endpoint serving hardcoded Question data. Implement frame rendering with 4 answer buttons.
- Outcome: Clicking start button shows question 1 with placeholder content and A-D options. Level stored in button metadata.
```

### Step 3: Answer Verification Foundation
```text
- Build: POST /api/answer that checks hardcoded correctIndex. Update GameState level on success, trigger gameover on failure.
- Outcome: Correct answers increment level in session data. Wrong answers show "Game Over" template with restart option.
```

### Step 4: Full Question Progression
```text
- Build: 15-level question array with difficulty progression. Dynamic /api/question/:level endpoint using cached questions.
- Outcome: Users can progress through all levels with increasing prize values. Session data reflects current level accurately.
```

### Step 5: Stateless HMAC Validation
```text
- Build: HMAC signing/validation for all requests using session state. Encode currentLevel and totalPrize in URL params.
- Outcome: Tampering with level numbers in requests gets rejected. Validated state shows correct user progress.
```

### Step 6: Crypto Payment Initiation
```text
- Build: POST /api/payout with wallet address collection. Generate QR code using Coinbase Commerce sandbox API.
- Outcome: Completing level 15 shows prize amount and payment QR. Mock transaction appears in testnet explorer.
```

### Step 7: Game State Recovery System
```text
- Build: Redis fallback storage with HMAC validation. Auto-sync between URL params and Redis when mismatched.
- Outcome: Users can resume sessions after interruptions. Session data persists for 1 hour across devices.
```

### Step 8: Production Payment Flow
```text
- Build: ERC-20 transfer via smart contract with gas optimization. Implement pending transactions queue and retry logic.
- Outcome: Real ETH/USDC transfers execute within 90 seconds. Failed payments automatically retry with adjusted gas.
```

### Step 9: Anti-Abuse Protections
```text
- Build: Rate limiting (5 requests/min) and signature validation via NEYNAR. Implement automatic session invalidation on abuse.
- Outcome: Brute-force answer attempts get blocked. Invalid signatures trigger immediate session termination.
```

### Step 10: Dynamic Question Fallback
```text
- Build: GPT-4 integration for question generation when cache empty. IPFS backup for question storage.
- Outcome: System serves new questions even if primary source fails. Question diversity maintained across sessions.
```
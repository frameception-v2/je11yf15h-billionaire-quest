### 1. Core Functionality

**Main User Flow:**
```
1. Start Frame (Welcome + Rules)
2. Question Sequence (15 levels, increasing difficulty)
3. Answer Verification → Correct → Next Question
                    → Wrong → Game Over
4. Final Prize Distribution (Crypto payment)
```

**Required API Endpoints:**
- `POST /api/start`: Initializes game session
- `POST /api/question/:level`: Serves question frame
- `POST /api/answer`: Processes answer submission
- `POST /api/payout`: Handles crypto payment
- `POST /api/gameover`: Shows failure state

**Key Data Structures:**
```typescript
type Question = {
  level: number;
  question: string;
  options: string[];
  correctIndex: number;
  prize: number; // In ETH/USDC
};

type GameState = {
  currentLevel: number;
  walletAddress?: string;
  totalPrize: number;
  livesRemaining: number;
};
```

### 2. Implementation Approach

**Frame Structure:**
```
Screens:
1. Welcome - "Ready to become a billionaire?" 
   (Start Button)
   
2. Question - Display question + 4 options
   (Buttons A-D + Lifeline)

3. Result - Correct/Wrong feedback
   (Next Question/Restart)

4. Payout - "You won X ETH!" 
   (Collect Prize Button)

5. Game Over - "Wrong answer!" 
   (Try Again Button)
```

**External API Integration:**
1. Blockchain RPC (Ethereum) for balance checks
2. Coinbase Commerce API for crypto payments
3. Decentralized storage (IPFS) for question bank

**State Management:**
- **Stateless HMAC:** Encode game state in signed URL params
- Redis Cache (Fallback): Store session data with 1h TTL
- Frame Metadata: Store current level in button indexes

### 3. Technical Considerations

**API Authentication:**
- Frame signatures verification via NEYNAR API
- Coinbase Commerce API key encryption
- Transaction signing via Hardware Security Module

**Critical Error Scenarios:**
1. Payment failure recovery
   - Fallback to pending transactions queue
   - Automatic retry mechanism
2. Question depletion handling
   - Dynamic question generation via GPT-4 fallback
3. State tampering protection
   - HMAC validation for all requests
   - Rate limiting (5 requests/min per user)

**Crypto Payment Flow:**
```
1. User provides wallet address at final screen
2. System generates payment QR code (ERC-20)
3. Smart contract verifies payment eligibility
4. Automatic transfer via scheduled cron job
```

**Optimizations:**
- Pre-render first 5 questions during initialization
- Gas fee optimization using EIP-1559 transactions
- Question cache with 1h expiration

This spec maintains the Frame v2 structure while adding game-specific features and crypto integration. Implementation can be done within 1000 LoC using existing Next.js patterns.
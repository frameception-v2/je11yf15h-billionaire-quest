- [x] Task 1: Create game initialization endpoint and welcome UI  
  File: src/server/routes/api/start.js  
  Action: Create  
  Description: Implement POST endpoint that creates GameState (level=0, totalPrize=0) in Redis with 1-hour TTL. Return Frame v2 component with start button.  
  API: POST /api/start  
  Code:  
  ```javascript
  router.post('/start', (req, res) => {
    const sessionId = crypto.randomUUID();
    redis.setEx(sessionId, 3600, JSON.stringify({level: 0, totalPrize: 0}));
    res.json({
      frame: <WelcomeFrame />,
      buttons: [{ label: "Start Game", action: "/api/question/1" }]
    });
  });
  ```  
  UI Component: components/frames/WelcomeFrame.jsx showing "Ready to become a billionaire?"  
  Completion: Session ID appears in Redis and start button triggers /api/question/1

- [x] Task 2: Implement question 1 endpoint and basic UI  
  File: src/server/routes/api/question/1.js  
  Action: Create  
  Description: Hardcoded POST endpoint serving question data with 4 answer options.  
  API: POST /api/question/1  
  Code:  
  ```javascript
  const question = {
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctIndex: 1
  };
  ```  
  UI Component: components/frames/QuestionFrame.jsx rendering question text and answer buttons  
  Completion: Start button click displays question with A-D options

- [x] Task 3: Build answer verification system  
  File: src/server/routes/api/answer.js  
  Action: Create  
  Description: POST endpoint comparing submitted answer against hardcoded correctIndex.  
  API: POST /api/answer  
  Code:  
  ```javascript
  router.post('/answer', (req, res) => {
    const {sessionId, answerIndex} = req.body;
    const gameState = JSON.parse(redis.get(sessionId));
    
    if(answerIndex === currentQuestion.correctIndex) {
      gameState.level++;
      redis.set(sessionId, JSON.stringify(gameState));
      return res.redirect(`/api/question/${gameState.level}`);
    } else {
      return res.json({frame: <GameOverFrame />});
    }
  });
  ```  
  UI Component: components/frames/GameOverFrame.jsx with restart option  
  Completion: Correct answers redirect to next level, wrong answers show game over

- [x] Task 4: Implement dynamic question progression  
  File: src/server/data/questions.ts  
  Action: Create  
  Description: Array of 15 questions with increasing difficulty and prize values.  
  API: GET /api/question/:level  
  Code:  
  ```javascript
  export const questions = [
    {level: 1, prize: 100, text: "...", options: [...]},
    // ...14 more levels
  ];
  ```  
  UI Component: components/frames/ProgressBar.jsx showing current level  
  Completion: Users can progress through all 15 levels with accurate prize display

- [x] Task 5: Add HMAC state validation  
  File: src/server/middleware/hmac.js  
  Action: Create  
  Description: Middleware validating HMAC signatures in all requests.  
  Code:  
  ```javascript
  const validateHMAC = (req, res, next) => {
    const receivedSig = req.headers['x-hmac-signature'];
    const computedSig = crypto.createHmac('sha256', SECRET)
      .update(JSON.stringify(req.body)).digest('hex');
    
    if(receivedSig !== computedSig) return res.status(401).send('Invalid signature');
    next();
  };
  ```  
  Completion: Tampered level numbers in requests get rejected

- [ ] Task 6: Build crypto payout system  
  File: src/server/services/payment.js  
  Action: Create  
  Description: Generate Coinbase Commerce QR codes for completed games.  
  API: POST /api/payout  
  Code:  
  ```javascript
  const generateQR = async (amount) => {
    const response = await coinbaseAPI.createCharge({
      pricing_type: "fixed_price",
      local_price: {amount, currency: "USD"}
    });
    return response.qr_code;
  };
  ```  
  UI Component: components/frames/PayoutFrame.jsx with QR display  
  Completion: Level 15 completion shows payment QR code

- [ ] Task 7: Implement Redis session recovery  
  File: src/server/middleware/session.js  
  Action: Create  
  Description: Auto-sync between URL params and Redis storage.  
  Code:  
  ```javascript
  const sessionSync = (req, res, next) => {
    const urlState = decodeState(req.query.state);
    const redisState = getFromRedis(req.sessionId);
    
    if(urlState.level !== redisState.level) {
      const mergedState = {...redisState, ...urlState};
      updateRedisAndSign(mergedState);
    }
    next();
  };
  ```  
  Completion: Users can resume sessions after 1 hour

- [ ] Task 8: Deploy production payment contract  
  File: contracts/Payout.sol  
  Action: Create  
  Description: Optimized ERC-20 transfer with gas estimation.  
  Code:  
  ```solidity
  function safeTransfer(address token, address to, uint256 amount) external {
    uint256 gasStart = gasleft();
    IERC20(token).transfer(to, amount);
    uint256 gasUsed = gasStart - gasleft();
    emit GasOptimized(gasUsed);
  }
  ```  
  Completion: Real transfers complete within 90 seconds

- [ ] Task 9: Add anti-abuse protections  
  File: src/server/middleware/security.js  
  Action: Create  
  Description: Rate limiter (5 req/min) and NEYNAR signature validation.  
  Code:  
  ```javascript
  const limiter = rateLimit({
    windowMs: 60_000,
    max: 5,
    handler: (req, res) => {
      redis.del(req.sessionId);
      res.status(429).send('Rate limit exceeded');
    }
  });
  ```  
  Completion: Brute-force attempts get blocked

- [ ] Task 10: Implement question fallback system  
  File: src/server/services/questionGenerator.js  
  Action: Create  
  Description: GPT-4 integration with IPFS backup storage.  
  Code:  
  ```javascript
  const generateQuestion = async (difficulty) => {
    const gptResponse = await openai.chat.completions.create({
      messages: [{role: "user", content: `Generate ${difficulty} question...`}]
    });
    return ipfs.add(JSON.stringify(gptResponse.choices[0].message));
  };
  ```  
  Completion: System serves questions even during primary source outages

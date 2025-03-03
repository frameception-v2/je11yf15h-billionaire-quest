import { NextResponse } from 'next/server';
import { PROJECT_TITLE } from '~/lib/constants';

// Mock Redis client - replace with real implementation
const redis = {
  get: async (key: string) => JSON.stringify({ level: 1, totalPrize: 0 }),
  set: async (key: string, value: string) => {},
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const answerIndex = parseInt(formData.get('index')?.toString() || '');
    const sessionId = 'temp-session-id'; // TODO: Implement proper session handling

    // Get game state from Redis
    const gameState = JSON.parse(await redis.get(sessionId));
    
    // Hardcoded correct answer for first question
    if (answerIndex === 1) {
      // Update game state
      gameState.level++;
      await redis.set(sessionId, JSON.stringify(gameState));

      // Redirect to next question
      return NextResponse.redirect(new URL(`/api/question/${gameState.level}`, request.url));
    }

    // Return game over frame
    return new NextResponse(
      JSON.stringify({
        frame: `<div>Game Over! ${PROJECT_TITLE}</div>`,
        buttons: [{ label: "Try Again", action: "/api/start" }]
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Answer verification failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

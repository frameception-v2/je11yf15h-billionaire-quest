"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function WelcomeFrame() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Ready to become a billionaire?</CardTitle>
        <CardDescription className="text-lg">
          Answer 15 questions correctly to win your fortune!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <button 
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          onClick={() => fetch('/api/start', { method: 'POST' })}
        >
          Start Game
        </button>
      </CardContent>
    </Card>
  );
}

function QuestionFrame({ question }: { question: Question }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Question {question.level}</CardTitle>
        <CardDescription className="text-sm">
          Prize: ${question.prize.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg">{question.text}</p>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded text-sm"
                onClick={() => {
                  const formData = new URLSearchParams();
                  formData.append('index', index.toString());
                  fetch('/api/answer', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  });
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GameOverFrame() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Game Over!</CardTitle>
        <CardDescription className="text-lg">
          Better luck next time!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <button 
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          onClick={() => fetch('/api/start', { method: 'POST' })}
        >
          Try Again
        </button>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);
  const [addFrameResult, setAddFrameResult] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }
  // Temporary mock questions - replace with API data later
  const mockQuestions = [
    { level: 1, prize: 100, text: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correctIndex: 1 },
    { level: 2, prize: 200, text: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctIndex: 1 },
    { level: 3, prize: 400, text: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], correctIndex: 2 }
  ];

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-300">
          {PROJECT_TITLE}
        </h1>
        <QuestionFrame question={mockQuestions.find(q => q.level === currentLevel)!} />
      </div>
    </div>
  );
}

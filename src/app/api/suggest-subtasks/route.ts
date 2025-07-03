import { type NextRequest, NextResponse } from "next/server";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await wait(delay);
    }
  }

  throw lastError!;
}

async function callGeminiAPI(prompt: string, apiKey: string) {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro"];

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      const errorData = await response.text();
      console.error(
        `Model ${model} failed with status ${response.status}:`,
        errorData
      );

      if (response.status === 503) {
        throw new Error(`Model ${model} is overloaded`);
      }

      continue;
    } catch (error) {
      console.error(`Error with model ${model}:`, error);

      if (model === models[models.length - 1]) {
        throw error;
      }
    }
  }

  throw new Error("All models failed");
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Break down the following task into 3-5 smaller, actionable subtasks. Each subtask should be specific and achievable.

Task Title: ${title}
${description ? `Task Description: ${description}` : ""}

Please provide only the subtasks as a numbered list, without any additional explanation or formatting. Each subtask should be on a new line and start with a number.

Example format:
1. First subtask
2. Second subtask
3. Third subtask`;

    const data = await retryWithBackoff(
      () => callGeminiAPI(prompt, apiKey),
      3,
      1000
    );

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      return NextResponse.json(
        { error: "Invalid response from Gemini API" },
        { status: 500 }
      );
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    const suggestions = generatedText
      .split("\n")
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((suggestion: string) => suggestion.length > 0)
      .slice(0, 5);

    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: "No valid suggestions generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error in suggest-subtasks API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("overloaded")) {
      return NextResponse.json(
        {
          error:
            "The AI service is currently overloaded. Please try again in a few moments.",
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      return NextResponse.json(
        {
          error: "API quota exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate suggestions. Please try again later.",
      },
      { status: 500 }
    );
  }
}

import { CopilotRuntime, GoogleGenerativeAIAdapter } from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

// This is the ADK Agent (AI Financial Assistant)
// It uses the Gemini model to interact with the user and provide financial advice
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const { handleRequest } = new CopilotRuntime();

    return handleRequest({
        req,
        serviceAdapter: new GoogleGenerativeAIAdapter({
            model: "gemini-1.5-pro",
        }),
    });
}

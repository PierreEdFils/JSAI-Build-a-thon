import dotenv from 'dotenv';
import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Endpoint and API key (fallbacks for local testing)
  const endpoint =
    process.env.AZURE_INFERENCE_SDK_ENDPOINT ??
    'https://aistudioaiservices596052621110.services.ai.azure.com/models';
  const apiKey = process.env.AZURE_INFERENCE_SDK_KEY ?? 'YOUR_KEY_HERE';

  // Initialize the Azure AI client
  const client = new ModelClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  // Define the chat messages
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What are 3 things to see in Seattle?' },
  ];

  try {
    // Call the chat/completions endpoint
    const response = await client.path('chat/completions').post({
      body: {
        messages,
        max_tokens: 4096,
        temperature: 1,
        top_p: 1,
        model: 'gpt-4o-mini',
      },
    });

    // Print the assistant's reply
    const reply = response.body.choices?.[0]?.message?.content;
    console.log(reply ?? JSON.stringify(response.body));
  } catch (err) {
    console.error('Error during chat completion:', err);
  }
}

// Run the main function
main();


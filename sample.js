import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "openai/gpt-4o.1"; // <-- Replace with your exact model ID here

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function main() {
  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  // Read image as base64
  const imagePath = resolve(__dirname, "contoso_layout_sketch.jpg");
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString("base64");

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Write HTML and CSS code for a web page based on this sketch."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              }
            }
          ]
        }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch(console.error);

import Replicate from "replicate";

function getReplicateClient(): Replicate {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is not set — image generation disabled");
  }
  return new Replicate({ auth: token });
}

function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith("replicate.delivery");
  } catch {
    return false;
  }
}

/**
 * Generate an ad visual using Replicate's Flux Schnell model.
 * Returns the generated image URL or null if generation fails.
 */
export async function generateAdImage(
  prompt: string
): Promise<string | null> {
  try {
    const replicate = getReplicateClient();
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: `Professional advertising visual, clean composition, brand-safe, high quality: ${prompt}`,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 90,
      },
    });

    // Flux returns an array of FileOutput objects (URLs)
    if (Array.isArray(output) && output.length > 0) {
      const firstOutput = output[0];
      // FileOutput has a .url() method or can be cast to string
      if (typeof firstOutput === "string") {
        return isValidImageUrl(firstOutput) ? firstOutput : null;
      }
      if (
        firstOutput &&
        typeof firstOutput === "object" &&
        "url" in firstOutput
      ) {
        const url = String((firstOutput as { url: () => string }).url());
        return isValidImageUrl(url) ? url : null;
      }
      // Fallback: try toString
      const fallback = String(firstOutput);
      return isValidImageUrl(fallback) ? fallback : null;
    }

    return null;
  } catch (error) {
    console.error(
      "Image generation failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Create an image prompt from ad copy suitable for visual generation.
 */
export function buildImagePrompt(
  brandName: string,
  hook: string,
  format: string
): string {
  const styleMap: Record<string, string> = {
    meme: "bold meme-style graphic, vibrant colors, eye-catching typography placeholder",
    "fake-text": "clean smartphone chat interface mockup, minimal design",
    "stat-card":
      "data visualization card, clean infographic style, bold numbers",
    ugc: "authentic user-generated content style photo, natural lighting, lifestyle",
    "napkin-math":
      "hand-drawn calculation on white background, sketch style, marker pen",
    "tweet-screenshot": "social media post card, minimal white design, clean typography",
    "slack-screenshot": "professional team chat interface, corporate purple accents",
    linkedin:
      "professional business visual, corporate photography style, clean gradient background",
  };

  const style = styleMap[format] || "professional advertising visual, clean and modern";

  return `${style}. Brand: ${brandName}. Theme: ${hook}. No text overlay, no watermarks, photorealistic quality.`;
}

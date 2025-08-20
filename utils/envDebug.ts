export function getGeminiKeyInfo() {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  return {
    present: !!key,
    length: key ? key.length : 0,
    prefix: key ? key.slice(0, 8) : undefined,
  };
}

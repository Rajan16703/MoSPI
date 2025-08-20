MoSPI

## Chatbot Feature

This project now includes a floating AI helper chatbot powered by Google Gemini. It can:

- Explain how to use the app (tabs, creating surveys, analytics)
- Suggest best practices for unbiased survey questions
- Provide guidance on statistical questionnaire design

### Setup

1. Copy `.env.example` to `.env` and add your Gemini API key:
	`EXPO_PUBLIC_GEMINI_API_KEY=your_key_here`
2. Install deps (includes cross-env for Windows):
	`npm install`
3. Start the dev server:
	`npm run dev`

### Usage

Tap the purple Ask bubble in the bottom-right to open the chat window. Messages are sent to the Gemini 1.5 Flash model via the public REST API.

If no key is set, the bot will inform you. Keys exposed with the `EXPO_PUBLIC_` prefix are accessible in the client bundle—only use keys with restricted quota / domain; do not expose sensitive credentials.

### Environment Variable

`EXPO_PUBLIC_GEMINI_API_KEY` – Public (client side) key for Gemini. Required for live responses.

### Customization

Edit `components/Chatbot.tsx` to adjust:

- System prompt (`SYSTEM_PROMPT`)
- Model endpoint or parameters (`temperature`, `maxOutputTokens`)
- UI styles in the `styles` object

### Privacy Note

User questions are sent directly to Google APIs. Avoid sending PII or confidential data.

### Future Ideas

- Streamed responses
- Server proxy for secure key handling
- Contextual grounding based on current screen


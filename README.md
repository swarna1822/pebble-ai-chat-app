# Pebble

A fast, friendly AI chat app built with React, TypeScript and Material UI.
Pebble runs entirely in your browser: there is no server, and your API key and chats stay on your device.

## Features

- Streaming replies that appear word by word, with Stop and Regenerate
- Markdown rendering, including lists, links and tables
- Code blocks with syntax highlighting and a Copy button
- Chat history saved in your browser, with new chat and delete
- Works with free providers: Google Gemini, Groq and OpenRouter
- Demo mode with fake replies, so it works without any key
- Light, dark or match-device theme
- Responsive layout, with the chat list as a drawer on mobile
- Keyboard shortcuts: Enter to send, Shift+Enter for a new line, Ctrl/Cmd+K for a new chat

## Tech stack

React 18, TypeScript, Vite, Material UI (MUI), react-markdown, highlight.js

## Getting started

You need Node.js 18 or newer (https://nodejs.org).

    npm install
    npm run dev

Open the address Vite prints, usually http://localhost:5173.

## Connect an AI provider

Pebble starts in Demo mode. For real answers, add a free API key:

| Provider | Where to get a key |
| --- | --- |
| Google Gemini | https://aistudio.google.com/api-keys |
| Groq | https://console.groq.com/keys |
| OpenRouter | https://openrouter.ai/keys |

Then, in the app:

1. Click **Settings**.
2. Choose the provider.
3. Paste your key into **API key**.
4. Leave **Model** blank to use the default, or type a model name.
5. Click **Save settings**.

Your key is saved in your browser only.

### Model names

Providers rename and retire models often. If you see a "model not found" error, list the models your key can use and type one into **Settings, Model**.

    curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer YOUR_KEY"
    curl https://generativelanguage.googleapis.com/v1beta/openai/models -H "Authorization: Bearer YOUR_KEY"

Default model names live in `src/providers.ts`.

### Optional: key from a file (your own computer only)

1. Open `.env.local` and paste your key after `VITE_GROQ_KEY=`.
2. Restart `npm run dev`.
3. If the app still shows Demo mode, clear old saved settings: press F12, open the Console, and run
   `localStorage.removeItem("ck.settings"); location.reload();`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build to `dist` |
| `npm run preview` | Preview the production build locally |

## Project structure

    src/
      App.tsx              layout, theme, settings, shortcuts
      useChats.ts          chat state, history, send, stop, regenerate
      stream.ts            fake streaming and real provider streaming
      providers.ts         provider URLs and default models
      storage.ts           localStorage helpers
      theme.ts             Material UI theme
      types.ts             shared types and default settings
      components/
        Sidebar.tsx        chat list, new chat, settings button
        ChatView.tsx       message list and empty state
        MessageBubble.tsx  user and assistant messages
        Markdown.tsx       markdown and code blocks
        Composer.tsx       message input
        SettingsDialog.tsx provider, key, model and theme

## Deploy

Pebble builds to static files, so any static host works.

1. Empty `.env.local` (set `VITE_GROQ_KEY=` with no value) so no key is baked into the build.
2. Run `npm run build`.
3. Upload the `dist` folder to Netlify (https://app.netlify.com/drop), or push the project to GitHub and import it into Vercel.

Visitors to your deployed site paste their own free key in Settings.

## Security notes

- Never commit your API key or paste it into chats, issues or screenshots.
- Anything starting with `VITE_` is copied into the built site and can be read by visitors. Use `.env.local` only on your own computer.
- If a key is ever exposed, delete it in the provider's console and create a new one.
- Letting visitors chat without their own key needs a small server-side proxy that holds the key and limits usage.

## Troubleshooting

| Message | What to do |
| --- | --- |
| Add your API key in Settings first | Open Settings and paste a key |
| The provider rejected your API key | Re-copy the key with no spaces, or create a new one |
| Doesn't accept this request / model not found | Type a current model name into Settings, Model |
| Free-tier limit reached | Wait a minute and click Regenerate, or switch provider |
| Couldn't reach the provider | Check your internet connection |

## Ideas for next steps

Rename chats, edit sent messages, a "load models" dropdown in Settings, and a small proxy so the app can be shared without exposing keys.
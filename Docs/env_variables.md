````markdown
# Task: Replace Anthropic (Claude) with Google Gemini API

The project currently uses the Anthropic (Claude) API. I have generated a **Google Gemini API key** and a **MongoDB URI**, and I want the application to use **Gemini** instead of Claude.

Your goal is to migrate the backend completely while preserving all existing functionality, prompts, business logic, receptionist flows, conversation history, tools, and APIs.

---

## Objectives

- Remove the Anthropic dependency completely.
- Integrate Google Gemini as the LLM provider.
- Keep the rest of the application unchanged.
- Ensure the frontend continues working without any modifications.
- Preserve all current features and AI behavior.

---

# Environment Variables

Update the project to use the following environment variables.

## Server (.env)

Replace:

```env
ANTHROPIC_API_KEY=
```

with

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_uri_here
ADMIN_TOKEN=5Qv9xL2mP8rN4kW7zF1aH6sJ0cD3yE9
PORT=5000
```

Update `.env.example` accordingly.

Remove any unused Anthropic environment variables.

---

# Dependencies

Remove:

- @anthropic-ai/sdk

Install the official Google Gemini SDK.

Use the latest recommended SDK.

---

# Backend Migration

Search the entire backend for:

- Anthropic
- Claude
- anthropic.messages.create()
- anthropic.complete()
- ANTHROPIC_API_KEY

Replace every Anthropic implementation with Gemini.

There must be **no remaining Anthropic imports or API calls** anywhere in the project.

---

# AI Service

If an AI service abstraction does not exist, create one.

Example:

```
server/
    services/
        ai.service.js
```

All AI requests should go through this service.

The rest of the application should never directly call Gemini.

---

# Gemini Configuration

Initialize Gemini using the environment variable.

Read the API key from:

```
process.env.GEMINI_API_KEY
```

Do not hardcode any secrets.

---

# Model

Use the latest fast production model.

Example:

```
gemini-2.5-flash
```

The model name should be defined in one place so it can be changed easily later.

---

# Conversation

Preserve:

- conversation history
- system prompts
- receptionist personality
- business information
- customer messages
- assistant replies

Conversation context should continue working exactly as before.

---

# Prompt Handling

Do not modify existing prompts unless required for Gemini compatibility.

Maintain:

- receptionist tone
- business instructions
- appointment behavior
- FAQ handling
- lead qualification
- booking logic

---

# API Responses

Normalize Gemini responses so the rest of the application receives the same response format as before.

The frontend should not require any changes.

---

# Error Handling

Implement proper handling for:

- invalid API key
- quota exceeded
- rate limiting
- network failures
- invalid responses

Return meaningful server errors instead of crashing.

---

# Logging

Log only useful debugging information.

Never log:

- API keys
- secrets
- customer private information

---

# MongoDB

Use the provided MongoDB URI.

Ensure:

- successful connection
- connection retries if already implemented
- proper error logging
- graceful shutdown

---

# Configuration

Update:

- README
- installation instructions
- setup documentation

Replace all references to:

- Claude
- Anthropic

with

- Google Gemini

---

# Code Quality

- Remove unused imports.
- Remove dead Anthropic code.
- Remove unused packages.
- Keep the code modular.
- Follow existing project architecture.
- Do not introduce duplicate code.

---

# Testing

Verify:

- server starts successfully
- MongoDB connects
- Gemini connects
- AI responds correctly
- chat endpoint works
- conversation memory works
- admin routes still work
- frontend communicates successfully

---

# Deliverables

Complete all required code changes.

At the end, provide a summary including:

1. Files modified
2. Files added
3. Packages removed
4. Packages installed
5. Environment variables changed
6. Any breaking changes (should be none)
7. Any manual steps remaining

The migration should be fully complete, production-ready, and require no additional Claude dependencies.
````

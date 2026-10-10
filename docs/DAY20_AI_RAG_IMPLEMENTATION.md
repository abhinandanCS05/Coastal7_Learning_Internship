# Day 20 — Streaming AI Product Assistant with RAG

## What was added

Day 20 extends the existing ShopFlow Day 19 application rather than replacing its architecture.

- Authenticated FastAPI endpoint: `POST /ai/chat/stream`.
- Status endpoint: `GET /ai/status`.
- Server-Sent Events (SSE) for incremental answer tokens and source metadata.
- OpenAI-compatible provider adapters for Groq, Gemini, and Mistral.
- Provider failover in the order configured by `AI_PROVIDER_ORDER`; a provider failure before the first token triggers the next configured provider.
- Persistent ChromaDB collection containing active product-catalogue records.
- Deterministic 384-dimensional hashing embeddings to keep the local implementation light and avoid a model download.
- LangChain `ChatPromptTemplate` to compose a system instruction, conversation history, retrieved context, and user question.
- A protected React AI assistant page with streaming output, starter questions, provider indicator, and source cards.
- `.env.example` entries for provider keys and AI configuration. No API keys are included.

## Architecture

```text
Signed-in ShopFlow user
       |
       v
React AI Product Assistant
       |
       | POST /ai/chat/stream + Bearer token
       v
FastAPI AI router
       |
       +--> SQLAlchemy: active product catalogue
       |
       +--> ChromaDB: index / retrieve relevant products
       |
       +--> LangChain ChatPromptTemplate: grounded prompt
       |
       +--> Groq -> Gemini -> Mistral (configured order)
       |
       v
SSE: source metadata -> provider -> token chunks -> done/error
       |
       v
Streaming chat UI + visible product source cards
```

## Setup

1. Use Python 3.11 or 3.12 and a supported Node.js LTS release.
2. From the project root, create and activate a virtual environment for the backend.
3. Install backend dependencies with `pip install -r backend/requirements.txt`.
4. Copy `backend/.env.example` to `backend/.env`.
5. Add one or more provider API keys to `backend/.env`. Keep this file private and do not commit it.
6. Start the existing backend using the project's normal backend launch workflow.
7. In another terminal, run `npm install` and `npm run dev` from `frontend`.
8. Sign in to ShopFlow and open `/app/ai-assistant`.

Example backend setup in Git Bash:

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add at least one provider API key.
uvicorn app.main:app --reload
```

Example frontend setup in Git Bash:

```bash
cd frontend
npm install
npm run dev
```

## Environment settings

- `GROQ_API_KEY`, `GEMINI_API_KEY`, `MISTRAL_API_KEY`: optional provider credentials; configure at least one.
- `AI_PROVIDER_ORDER`: comma-separated failover order, e.g. `groq,gemini,mistral`.
- `GROQ_MODEL`, `GEMINI_MODEL`, `MISTRAL_MODEL`: model overrides.
- `AI_CHAT_MAX_TOKENS`: output-token cap.
- `AI_CHAT_TEMPERATURE`: response variability.
- `AI_CHROMA_PATH`: persistent ChromaDB storage directory.

Provider availability, model names, free-tier limits, and quotas can change. The application intentionally reads API keys from environment variables and does not assume that a free tier is unlimited.

## Important implementation notes

### Retrieval quality
The initial embedding function is deterministic feature hashing, not a pretrained semantic embedding model. It supports repeatable vector indexing and similarity retrieval without downloading a model, but semantic matching is less capable than a dedicated embedding model. For production-grade semantic search, replace `_embed_text` with a supported embedding model and re-index the catalogue.

### Provider fallback
Fallback occurs when a provider fails before any response token has been sent. If a provider fails after streaming has started, the endpoint reports an error instead of silently concatenating a second provider's answer onto a partial first answer.

### Source citations
The UI displays the catalogue records retrieved by ChromaDB, and the prompt instructs the model to cite product names and IDs. These are retrieval sources, not external web citations. Verify the product details before relying on generated advice.

### Data and privacy
Only active product catalogue rows are indexed. Customer addresses, passwords, carts, orders, and other user data are not indexed. API keys belong in the ignored local `backend/.env`, never in React/Vite environment variables.

### Limitations
- At least one valid provider API key is required for generated responses.
- ChromaDB stores a local persistent index under the backend data directory.
- The retrieval implementation refreshes/upserts the current active catalogue on each chat request for correctness; this is suitable for the small training catalogue but should become incremental/background indexing at larger scale.
- The existing product catalogue schema does not have a separate product URL field, so source cards cite product name and product ID.

## Day 20 verification checklist

- [ ] Backend starts with the new dependencies installed.
- [ ] `/docs` shows the AI Assistant endpoints.
- [ ] Signed-out requests to `/ai/status` and `/ai/chat/stream` are rejected.
- [ ] `/ai/status` reports provider names only and never returns secret values.
- [ ] One configured provider produces SSE tokens.
- [ ] A deliberately invalid primary key falls back to the next configured provider.
- [ ] Retrieved product source cards appear in the UI.
- [ ] Existing login, catalogue, cart, checkout, orders, and admin flows remain available.
- [ ] `npm run build` succeeds.
- [ ] No `.env`, virtual environment, `node_modules`, or generated test-report artifacts are included in the ZIP.

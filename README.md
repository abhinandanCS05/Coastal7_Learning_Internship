# zetA — Day 20 AI RAG Streaming Assistant
---

## 1. Project Overview

The Day 20 implementation introduces an AI-powered shopping assistant into the ShopFlow e-commerce application. It combines a FastAPI backend, a dedicated AI-service layer, product-catalogue retrieval using ChromaDB, structured prompt construction using LangChain, multi-provider LLM orchestration, Server-Sent Events (SSE), and a React/Vite frontend.

The assistant is designed to answer natural-language product questions using retrieved catalogue information and to display relevant product-source cards alongside the generated response.

The implementation focuses on four core capabilities:

- Retrieval-Augmented Generation (RAG) for catalogue-aware responses.
- Real-time streaming of generated responses to the frontend.
- LLM provider fallback for eligible failures before response output begins.
- Integration of the AI assistant into the existing zetA interface.

## 2. Problem Statement and Use Case

Traditional e-commerce search often requires users to enter exact product names or manually navigate through categories and filters. A conversational shopping assistant allows users to describe their needs naturally and receive a response based on relevant product-catalogue information.

### Example use case

A customer asks:

> Suggest suitable products for a home office within my budget.

The application retrieves relevant product records, constructs a prompt containing the user query and retrieved context, sends it to a configured LLM provider, streams the generated answer through SSE, and displays relevant product-source cards in the frontend.

The assistant is intended for product discovery and catalogue Q&A. Order placement, autonomous transactions, and persistent personal-memory functionality are not established as part of the recorded Day 20 scope.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Backend framework | FastAPI |
| Frontend | React and Vite |
| AI service integration | Groq, Gemini, Mistral |
| Recorded Groq model | `openai/gpt-oss-20b` |
| Retrieval framework | Retrieval-Augmented Generation (RAG) |
| Vector store | ChromaDB |
| Vectorization approach | Deterministic token hashing |
| Hash algorithm recorded | BLAKE2 |
| Recorded vector dimensionality | 384 |
| Prompt construction | LangChain `ChatPromptTemplate` |
| Streaming mechanism | Server-Sent Events (SSE) |


**Embedding clarification:** The recorded implementation uses deterministic token-hashing vectors, not a pretrained semantic embedding model. The exact hash mapping and normalization should be confirmed in the implementation.

## 4. System Architecture

```text
                  CUSTOMER
                      |
                      v
          React / Vite AI Chat Interface
          frontend/src/pages/AIChat.tsx
                      |
              HTTP Request / SSE
                      |
                      v
              FastAPI AI Router
          backend/app/ai_router.py
                      |
                      v
               AI Service Layer
          backend/app/ai_service.py
                      |
             +--------+---------+
             |                  |
             v                  v
      Product Retrieval    Prompt Construction
             |             LangChain
             v             ChatPromptTemplate
          ChromaDB                |
             |                    |
             v                    |
      Retrieved Product Context --+
                      |
                      v
             LLM Orchestration
                      |
             +--------+---------+
             |        |         |
             v        v         v
           Groq     Gemini    Mistral
             |
             v
      Generated Response
             |
             v
        SSE Response Stream
             |
             v
        React Chat Interface
             |
             v
      Answer + Product Sources
```

### Component responsibilities

**Frontend — `frontend/src/pages/AIChat.tsx`**

- Provides the AI shopping-assistant interface.
- Collects the user's question.
- Consumes the streaming response.
- Displays generated content and product-source cards.

**Backend router — `backend/app/ai_router.py`**

- Exposes the AI API routes.
- Handles the HTTP streaming boundary.
- Connects incoming chat requests to the AI service.

**AI service — `backend/app/ai_service.py`**

- Coordinates product retrieval.
- Constructs prompts using retrieved context.
- Orchestrates configured LLM providers.
- Handles eligible provider fallback and response streaming.

**ChromaDB**

- Stores and retrieves product-catalogue vector representations and associated metadata.
- Supplies candidate product context for the generation step.

**LangChain `ChatPromptTemplate`**

- Structures model instructions, retrieved context, and the user query into a reusable prompt format.

## 5. End-to-End Workflow

### Stage 1 — Product-catalogue preparation

Product information is prepared for retrieval and represented using the configured deterministic token-hashing method. The resulting vectors and associated metadata are stored in a ChromaDB collection.

The local vector index is generated runtime data and is excluded from the Git submission. A fresh environment may need to initialize or rebuild the index according to the application implementation.

### Stage 2 — User query submission

The user submits a natural-language product question through the React chat interface. The frontend sends the request to the FastAPI streaming endpoint.

### Stage 3 — Query vectorization and retrieval

The AI service converts the query using the configured vectorization method and retrieves candidate product records from ChromaDB.

The index-time and query-time vectorization logic must remain compatible for retrieval to work correctly.

### Stage 4 — Prompt construction

The service assembles retrieved product information into the prompt context and uses LangChain `ChatPromptTemplate` to structure the instructions and user query.

This provides the LLM with catalogue information relevant to the current question rather than relying solely on its pretrained knowledge.

### Stage 5 — LLM inference

The AI service attempts the configured provider sequence. The recorded preference order is Groq, Gemini, and Mistral.

The selected provider generates a natural-language response using the constructed prompt.

### Stage 6 — Streaming response

Generated response fragments are returned through Server-Sent Events. The frontend consumes the stream and progressively updates the active assistant response.

### Stage 7 — Product-source display

The frontend displays relevant product-source cards alongside the generated answer, connecting the conversational response to catalogue items.

The exact request schema, SSE event names, and payload formats are implementation-specific and should be verified directly in the router and frontend consumer.

## 6. LLM Providers and Model Configuration

### Primary provider — Groq

The recorded Groq model used during local verification was:

`openai/gpt-oss-20b`

A successful response was observed during the local verification session.

### Fallback providers

The recorded provider preference order is:

1. **Groq**
2. **Gemini**
3. **Mistral**

Gemini and Mistral are configured as fallback providers in the recorded implementation.

### What the LLM does

The LLM generates the natural-language answer from the prompt and retrieved context.

It is important to distinguish the responsibilities of each component:

- **Vectorization:** Converts product text and queries into numerical representations.
- **ChromaDB:** Retrieves candidate product records.
- **Prompt construction:** Combines instructions, query, and retrieved context.
- **LLM:** Generates the conversational response.
- **SSE:** Transports response fragments to the frontend.

The Groq model is not the embedding model.

## 7. Provider Fallback Mechanism

The fallback mechanism is intended to reduce dependence on a single LLM provider.

### Fallback workflow

```text
Incoming Chat Request
         |
         v
   Attempt Groq
         |
         +---- Failure before first token?
         |              |
         |             Yes
         |              |
         |              v
         |       Attempt Gemini
         |              |
         |              +---- Eligible failure?
         |                          |
         |                         Yes
         |                          |
         |                          v
         |                   Attempt Mistral
         |                          |
         |                          v
         |                  Controlled failure
         |
         +---- Successful generation
                        |
                        v
               Begin SSE streaming
                        |
                        v
                Stream to frontend
```

### Why fallback is constrained after streaming starts

Once response tokens have been sent to the frontend, switching to another provider may create duplicated, contradictory, or discontinuous content.

The recorded strategy therefore focuses fallback on failures that occur before any response token has been emitted.

Failures after streaming begins should be handled through a defined stream-error or termination path rather than silently restarting a different completion.

### Fallback verification

During local verification, an invalid Groq model configuration was used to exercise the fallback path. The recorded test successfully reached Gemini and returned a response.

This establishes that one fallback path was exercised. 

## 8. RAG and Vectorization Details


Retrieval-Augmented Generation combines information retrieval with LLM generation.

Instead of asking the LLM to answer solely from its pretrained knowledge, the application retrieves relevant records and includes them in the prompt at request time.

### Day 20 retrieval approach

The recorded implementation uses deterministic token hashing with BLAKE2 and a 384-dimensional vector representation.

BLAKE2 is a hashing algorithm, not a pretrained embedding model.

### Advantages

- Lightweight and computationally inexpensive.
- Deterministic and reproducible when configuration and input processing remain consistent.
- Does not require a separate pretrained embedding inference API.

### Limitations

- Does not inherently understand word meaning or semantic relationships.
- Synonyms and paraphrases may not retrieve the most relevant product records.
- Retrieval quality depends on text preparation, vector construction, and the retrieval configuration.

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `/ai/chat/stream` | Streaming chat response through SSE |
| `/ai/status` | AI service status endpoint, documented as authenticated |
| `/health` | Backend health check |

The backend health endpoint returned a healthy/OK status during local verification, and the catalogue reported 120 products.

The precise request fields, HTTP method, SSE event names, and payload formats should be confirmed from the current implementation.

## 10. Conversation History and Memory

**Important: Durable chat-history storage and long-term user memory are not implemented.**

Three different concepts must be distinguished.

### A. RAG catalogue storage

ChromaDB is used for product-catalogue retrieval. The existence of a persistent vector index does not imply that user conversations are stored in it.

### B. Active conversation context

Previous messages might be held in frontend state or sent to the backend as part of a request. 


## 11. Repository Structure

```text
ShopFlow_Day20_AI_RAG_Streaming_Assistant/
├── backend/
│   ├── app/
│   │   ├── ai_router.py
│   │   ├── ai_service.py
│   │   └── ... existing backend modules
│   ├── data/
│   │   └── chroma/             # Generated runtime vector data
│   └── .env.example
├── frontend/
│   └── src/
│       └── pages/
│           └── AIChat.tsx
├── docs/
│   └── DAY20_AI_RAG_IMPLEMENTATION.md
├── RUN_BACKEND.ps1
├── RUN_FRONTEND.ps1
├── .gitignore
└── README.md
```

### Key implementation files

| File | Responsibility |
|---|---|
| `backend/app/ai_router.py` | AI routes and SSE response boundary |
| `backend/app/ai_service.py` | Retrieval, prompt construction, provider orchestration |
| `frontend/src/pages/AIChat.tsx` | Chat interface and streaming-response consumption |
| `.env.example` | Configuration template |


## Final Status

The Day 20 AI RAG Streaming Assistant implementation was committed and pushed to the `day20-ai-rag` feature branch. The recorded frontend build, TypeScript, backend import, health-endpoint, and unit-test checks passed, and one provider fallback path was exercised.

Formal technical review and pull-request creation remain pending. Chat-history persistence and long-term user memory require confirmation from the source code before being claimed.

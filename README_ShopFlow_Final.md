::: {align="center"}
# ShopFlow --- AI-Enhanced Full-Stack E-Commerce Platform

**Internship Engineering Portfolio · Coastal Seven Technologies Private
Limited · Knowledge Factory, Batch 7**

A full-stack e-commerce application built across a 24-day engineering
programme, evolving from Python and API fundamentals into a deployed
React/Vite + FastAPI platform with PostgreSQL, background processing,
real-time updates, AI-assisted product experiences, automated
validation, and load testing.

[Live Frontend](https://zeta-0pew.onrender.com) · [Backend
API](https://zetaa.onrender.com) · [Swagger
UI](https://zetaa.onrender.com/docs) · [GitHub
Repository](https://github.com/abhinandanCS05/Coastal7_Learning_Internship)
:::

------------------------------------------------------------------------

## Contents

-   [Project Overview](#project-overview)
-   [Live Environments and Evidence](#live-environments-and-evidence)
-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [System Architecture](#system-architecture)
-   [Application Workflows](#application-workflows)
-   [AI and RAG Design](#ai-and-rag-design)
-   [Background Jobs and Real-Time
    Events](#background-jobs-and-real-time-events)
-   [Repository Structure](#repository-structure)
-   [Configuration and Secrets](#configuration-and-secrets)
-   [Run Locally](#run-locally)
-   [Testing and Quality](#testing-and-quality)
-   [Performance and Database
    Engineering](#performance-and-database-engineering)
-   [Deployment Architecture](#deployment-architecture)
-   [CI/CD and Git Workflow](#cicd-and-git-workflow)
-   [Daily Engineering Checklist](#daily-engineering-checklist)
-   [Security and Operational Notes](#security-and-operational-notes)
-   [Known Platform Decisions](#known-platform-decisions)
-   [Learning Outcomes](#learning-outcomes)
-   [Maintainer and Credits](#maintainer-and-credits)

## Project Overview

ShopFlow is an AI-enhanced e-commerce application developed during the
Coastal Seven Knowledge Factory internship. The work spans backend
engineering, frontend development, database integration, authentication,
asynchronous processing, real-time communication, AI-assisted features,
containerization, automated validation, deployment, and performance
testing.

The application is deployed as separate frontend and backend services on
**Render**, with **PostgreSQL hosted on Neon**. The repository also
contains Dockerfiles, a Docker Compose integration environment, and
GitHub Actions workflows for validation and container-image publishing.

### Project objectives

-   Build a maintainable REST API and integrate it with a responsive web
    client.
-   Implement relational persistence, authentication, authorization, and
    database lifecycle management.
-   Support background tasks and real-time status updates.
-   Integrate AI-powered assistance, retrieval-grounded responses,
    semantic product discovery, and generated product content.
-   Introduce automated testing, containerized integration, CI/CD, and
    load testing.
-   Deploy the application using a cost-conscious managed-hosting
    architecture and document the operational decisions.

## Live Environments and Evidence

  ------------------------------------------------------------------------------------------------------------------------------------------------
  Resource                URL                                                                                              Purpose
  ----------------------- ------------------------------------------------------------------------------------------------ -----------------------
  Frontend                [zeta-0pew.onrender.com](https://zeta-0pew.onrender.com)                                         React/Vite user
                                                                                                                           interface

  Backend                 [zetaa.onrender.com](https://zetaa.onrender.com)                                                 FastAPI API service

  Interactive API         [Swagger UI](https://zetaa.onrender.com/docs)                                                    Explore API routes and
  documentation                                                                                                            schemas

  GitHub repository       [Coastal7_Learning_Internship](https://github.com/abhinandanCS05/Coastal7_Learning_Internship)   Source code and
                                                                                                                           engineering history

  DevOps pull request     [PR #1](https://github.com/abhinandanCS05/Coastal7_Learning_Internship/pull/1)                   Container and
                                                                                                                           environment hardening

  GitHub Actions evidence [Workflow                                                                                        Backend/frontend
                          run](https://github.com/abhinandanCS05/Coastal7_Learning_Internship/actions/runs/38534460711)    validation, Compose
                                                                                                                           integration and image
                                                                                                                           publishing
  ------------------------------------------------------------------------------------------------------------------------------------------------

**Deployment model:** Render hosts the public frontend and backend; Neon
hosts PostgreSQL. Redis/Celery and the full service topology are
represented in the repository's integration configuration and
application workflows. The services actually active in a given
environment depend on that environment's configuration.

## Features

### E-commerce experience

-   Product catalogue browsing and product detail views.
-   Product search, filtering, sorting, and category/subcategory
    discovery.
-   Customer authentication and protected application views.
-   Cart and checkout workflows.
-   Order history and order-status experiences.
-   Administrative product and inventory workflows.

### Backend and data

-   FastAPI REST endpoints with request/response validation.
-   Pydantic schemas and SQLAlchemy-based database access.
-   PostgreSQL integration with environment-based connection
    configuration.
-   Authentication and role-based authorization patterns.
-   Database migrations and structured error handling.
-   Health endpoint and API documentation.

### Background processing and real-time updates

-   Redis integration for caching and task/message coordination.
-   Celery background jobs, task state and scheduled processing
    patterns.
-   WebSocket-based order updates and notifications.
-   Bulk processing and report/invoice-generation workflows recorded
    during the programme.

### AI-enhanced capabilities

-   Streaming AI responses.
-   Retrieval-augmented product assistance using relevant
    catalogue/context data.
-   Semantic product search.
-   AI-generated product descriptions and copy.
-   Provider fallback and output validation patterns.
-   Caching and rate-control considerations for AI requests.
-   Controlled tool-calling/agent patterns for application tasks.

### Engineering and delivery

-   Docker multi-stage build patterns.
-   Docker Compose integration environment.
-   GitHub Actions validation and image publishing.
-   Environment-variable-based configuration.
-   Locust-based concurrent load testing.
-   Production ASGI serving with Gunicorn and Uvicorn workers.
-   Render deployment and runtime-log inspection.

## Technology Stack

  -----------------------------------------------------------------------
  Area                    Technology              Role
  ----------------------- ----------------------- -----------------------
  Frontend                React, Vite, TypeScript UI, client-side routing
                                                  and typed frontend
                                                  contracts

  Styling and UI          Tailwind CSS, component Responsive UI and
                          library patterns,       reusable components
                          Lucide icons            

  Client state            Zustand                 Client-side state such
                                                  as cart and
                                                  user-interface state

  Server state            TanStack Query          API query caching,
                                                  mutations and
                                                  server-state lifecycle

  Forms and validation    React Hook Form, Zod    Form state and schema
                                                  validation

  Backend                 Python, FastAPI,        API routes, validation
                          Pydantic                and application
                                                  services

  Persistence             PostgreSQL on Neon      Managed relational
                                                  database

  ORM and migrations      SQLAlchemy 2.x, Alembic Data access, sessions
                                                  and schema evolution

  Cache / broker          Redis                   Cache and asynchronous
                                                  task/message
                                                  coordination

  Background jobs         Celery, Celery Beat     Worker tasks and
                                                  scheduled processing

  Real-time               WebSockets              Order updates and
                                                  notification flows

  AI                      LLM provider            Context-aware
                          integrations, RAG and   assistance and
                          semantic retrieval      generated content
                          patterns                

  Testing                 Pytest, Vitest, React   Backend and frontend
                          Testing Library,        validation
                          Playwright              

  Load testing            Locust                  Concurrent workload and
                                                  latency observations

  Containers              Docker, Docker Compose  Reproducible packaging
                                                  and integration

  CI/CD                   GitHub Actions, GHCR    Automated checks and
                                                  container-image
                                                  publishing

  Hosting                 Render, Neon            Public application
                                                  services and managed
                                                  PostgreSQL
  -----------------------------------------------------------------------

> Exact dependency versions are defined by the repository's dependency
> manifests and lockfiles. This table intentionally focuses on
> technologies and responsibilities rather than asserting unverified
> version numbers.

## System Architecture

``` mermaid
flowchart TB
    USER["Customer / Admin"] --> BROWSER["Browser"]
    BROWSER --> FRONT["React + Vite Frontend<br/>Render · HTTPS"]
    FRONT -->|"REST / JSON"| API["FastAPI Backend<br/>Render"]
    FRONT <-->|"WebSocket events"| API

    API --> AUTH["Authentication & Authorization"]
    API --> SERVICE["Business Logic / API Services"]
    SERVICE --> DB[("PostgreSQL<br/>Neon")]
    SERVICE <--> REDIS[("Redis<br/>Cache / Broker")]
    SERVICE --> AI["AI Service Layer<br/>RAG · Streaming · Semantic Search"]
    SERVICE --> TASK["Celery Task Queue"]
    REDIS --> WORKER["Celery Workers / Beat"]
    TASK --> WORKER
    WORKER --> DB
    WORKER --> AI

    API --> HEALTH["Health Endpoint / Runtime Logs"]
    GIT["GitHub Repository"] --> CI["GitHub Actions"]
    CI --> CHECKS["Backend + Frontend Checks"]
    CI --> COMPOSE["Docker Compose Integration"]
    CI --> GHCR["GHCR Image Publishing"]
```

### Architecture responsibilities

  -----------------------------------------------------------------------
  Layer                               Responsibility
  ----------------------------------- -----------------------------------
  Presentation                        React/Vite pages, reusable
                                      components, forms, product browsing
                                      and customer/admin flows

  API                                 FastAPI endpoints, validation,
                                      authorization and business logic

  Persistence                         PostgreSQL data and SQLAlchemy
                                      session/connection handling

  Background processing               Redis/Celery task dispatch, worker
                                      execution, retries and status
                                      handling

  Real-time communication             WebSocket connections and event
                                      delivery

  AI service layer                    Context retrieval, prompt assembly,
                                      provider calls, streaming and
                                      response validation

  Operations                          Deployment logs, health checks,
                                      CI/CD and performance tests
  -----------------------------------------------------------------------

## Application Workflows

### 1. Standard API request

``` mermaid
sequenceDiagram
    actor User
    participant UI as React/Vite
    participant API as FastAPI
    participant DB as PostgreSQL/Neon

    User->>UI: Browse, search or submit action
    UI->>UI: Validate input and update client state
    UI->>API: HTTPS request with JSON
    API->>API: Validate schema and access permissions
    API->>DB: Read/write through SQLAlchemy
    DB-->>API: Query result
    API-->>UI: JSON response / error
    UI-->>User: Render result or feedback
```

### 2. Authentication and protected operations

1.  A user submits credentials through the frontend.
2.  The backend validates the request and performs the configured
    authentication flow.
3.  Authenticated requests carry the appropriate token/credentials.
4.  FastAPI dependencies and authorization rules protect restricted
    routes.
5.  The API returns the requested resource or a structured authorization
    error.
6.  Frontend route guards and UI state reflect the current
    authentication state; server-side authorization remains
    authoritative.

### 3. Background task lifecycle

``` mermaid
flowchart LR
    A["Frontend action"] --> B["FastAPI validates request"]
    B --> C["Queue task"]
    C --> D["Redis / Broker"]
    D --> E["Celery worker"]
    E --> F["Process task / DB operation"]
    F --> G["Store result or status"]
    G --> H["Frontend retrieves status or receives update"]
```

This pattern is appropriate for longer-running work such as bulk
processing, document generation and other asynchronous operations. The
request can acknowledge task submission without requiring the browser to
wait for all processing to finish.

### 4. Real-time workflow

``` mermaid
flowchart LR
    CLIENT["React WebSocket Client"] <-->|"Persistent connection"| API["FastAPI WebSocket Handler"]
    API <--> EVENT["Application Event / Redis Pub/Sub"]
    EVENT --> TASK["Order or notification update"]
    TASK --> API
    API --> CLIENT
```

WebSockets are used for supported live experiences such as order-status
updates and notifications. REST remains the standard path for ordinary
request/response operations.

## AI and RAG Design

### Query-time RAG workflow

``` mermaid
flowchart TD
    Q["User question / product query"] --> V["Validate request and context"]
    V --> R["Retrieve relevant product or catalogue context"]
    R --> P["Construct grounded prompt"]
    P --> L["Configured LLM provider"]
    L --> O["Validate generated output"]
    O -->|Valid| S["Return or stream answer"]
    O -->|Invalid / provider failure| F["Fallback or controlled error"]
    F --> S
    S --> UI["Render response in frontend"]
```

### How the AI flow works

1.  **Request intake:** The frontend submits a question, product-search
    query or content-generation request.
2.  **Validation:** The backend validates the request and relevant
    application context.
3.  **Retrieval:** For RAG-enabled requests, the system retrieves
    relevant product/catalogue context to ground the response.
4.  **Prompt construction:** The retrieved context and user request are
    assembled into the model input.
5.  **Generation:** The configured provider generates a response;
    supported endpoints can stream output to the frontend.
6.  **Output checks:** The response is checked before being returned or
    cached. Incomplete or invalid outputs should follow fallback/error
    handling.
7.  **Presentation:** The frontend displays the response or generated
    content.

### AI feature map

  -----------------------------------------------------------------------
  Feature                             Purpose
  ----------------------------------- -----------------------------------
  Product assistant                   Answer product-related questions
                                      using application context

  RAG                                 Ground model responses in retrieved
                                      catalogue/context information

  Semantic search                     Find relevant products using
                                      semantic similarity rather than
                                      exact keyword matches alone

  AI copywriter / descriptions        Generate product descriptions and
                                      other catalogue copy

  Streaming                           Deliver response content
                                      incrementally where supported

  Provider fallback                   Handle provider failures or
                                      unsuitable output more gracefully

  Caching and rate control            Reduce repeat work and control
                                      request volume where configured

  Tool-calling patterns               Let the model request bounded
                                      application operations through
                                      controlled backend logic
  -----------------------------------------------------------------------

**Design boundary:** RAG is the retrieval-and-generation pattern. The
exact embedding model, vector-store configuration, chunking parameters
and index lifecycle should be taken from the corresponding
implementation/configuration in the repository rather than inferred from
this high-level README.

## Repository Structure

The current repository root includes backend, frontend, deployment
configuration, workflows and documentation. The following is a logical
overview of the major areas:

``` text
Coastal7_Learning_Internship/
├── .github/
│   └── workflows/
│       └── day23-ci.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       └── API routes, schemas, services and integrations
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       └── types/
├── docs/
├── compose.yaml
├── .env.example
├── .gitignore
├── RUN_BACKEND.ps1
├── RUN_FRONTEND.ps1
├── README.md
└── LICENSE
```

The frontend and backend subdirectories may contain additional modules
and test directories. Consult the source tree for the exact current file
paths.

## Configuration and Secrets

The repository provides `.env.example` as a template. Create a local
`.env` from the template and replace placeholders with values
appropriate for the selected environment.

``` dotenv
POSTGRES_PASSWORD=replace-with-a-unique-password
JWT_SECRET=replace-with-a-long-random-secret
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

These are example values only.

-   Never commit real credentials, API keys, database URLs or JWT
    secrets.
-   Configure production frontend URLs to point to the deployed API, not
    `localhost`.
-   Use `https://` for public API endpoints and `wss://` for secure
    WebSocket connections when the deployment supports them.
-   Frontend variables prefixed with `VITE_` are bundled into
    client-side assets and must **not** contain secrets.
-   Keep development and production environment settings separate.
-   Production service configuration is managed through Render and Neon
    settings.

## Run Locally

### Prerequisites

-   Python version compatible with `backend/requirements.txt`
-   Node.js version compatible with `frontend/package.json`
-   Git
-   PostgreSQL and Redis if running the complete local integration stack
-   Docker Desktop with Docker Compose plugin if using the Compose
    workflow

### 1. Clone the repository

``` bash
git clone https://github.com/abhinandanCS05/Coastal7_Learning_Internship.git
cd Coastal7_Learning_Internship
git checkout day22-ai-application
```

The deployment branch may advance after this README is published. Use
the intended branch or commit for reproducible results.

### 2. Configure environment

``` powershell
Copy-Item .env.example .env
```

Edit `.env` with appropriate local values. Do not share or commit the
file.

### 3. Start the backend

``` powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start the API using the entry point and command documented by the
current backend package. For the standard development setup, the
intended local API port is `8000`; confirm the actual ASGI module path
from the backend source before starting the server.

Swagger UI is typically available at:

``` text
http://127.0.0.1:8000/docs
```

### 4. Start the frontend

In a separate terminal:

``` powershell
cd frontend
npm ci
npm run dev
```

Vite prints the local URL when the development server starts. Ensure
`VITE_API_URL` and `VITE_WS_URL` point to the local backend endpoints
for local development.

### 5. Docker Compose integration

From the repository root, configure the required environment variables
and use:

``` powershell
docker compose config
docker compose up --build
docker compose ps
docker compose logs -f
```

The Compose environment covers the application integration services
defined in `compose.yaml`. A working Docker Engine and Compose plugin
are required.

## Testing and Quality

The repository includes backend/frontend validation and container
integration in its CI workflow. Test commands can differ by package and
test directory; use the scripts declared in each package.

### Frontend checks

``` powershell
cd frontend
npm ci
npm run typecheck
npm test
npm run build
```

### Backend checks

Create/activate the backend virtual environment, install
`backend/requirements.txt`, then run the test command and paths defined
in the backend project. A common invocation when the repository uses
Pytest is:

``` powershell
pytest
```

### CI/CD evidence

The merged DevOps workflow included three successful jobs:

-   Backend and frontend validation.
-   Docker Compose integration.
-   Container-image publishing to GHCR.

[View the recorded GitHub Actions
run](https://github.com/abhinandanCS05/Coastal7_Learning_Internship/actions/runs/38534460711).

## Performance and Database Engineering

### Locust

Locust was used to exercise concurrent API traffic and observe
throughput, latency and request errors. Recorded test notes included:

-   A baseline run with approximately 50 users for around two minutes.
-   Approximately 871 requests in that baseline, with zero failures
    reported.
-   Mean latency around 4.48 seconds, median around 4.8 seconds, maximum
    around 9.38 seconds and throughput around 7.45 requests/second.
-   A later run reaching up to 60 concurrent users for approximately
    eight minutes, with zero request errors reported in that run.

These are observations from the tested workload and environment, not a
guarantee of capacity under every traffic pattern.

### PostgreSQL connection management

-   PostgreSQL is hosted on Neon for the public deployment.
-   SQLAlchemy manages application database access and sessions.
-   Recorded non-SQLite pool settings included `pool_size=5`,
    `max_overflow=5`, `pool_timeout=30` seconds and `pool_recycle=300`
    seconds.
-   Request-scoped sessions are closed through deterministic cleanup
    logic.
-   Pool sizing must be considered alongside worker count, request
    concurrency, query duration and database connection limits.

### Production serving

The FastAPI service uses a Gunicorn command with Uvicorn workers in the
Render deployment. Worker and pool settings should be tuned together to
avoid creating more concurrent database demand than the database can
support.

## Deployment Architecture

``` mermaid
flowchart TB
    BROWSER["Customer Browser"] -->|"HTTPS"| RENDER_FE["Render Frontend Service<br/>React + Vite"]
    RENDER_FE -->|"Configured API URL"| RENDER_API["Render Backend Service<br/>FastAPI + Gunicorn/Uvicorn"]
    BROWSER <-->|"Secure WebSocket where configured"| RENDER_API
    RENDER_API -->|"PostgreSQL connection string"| NEON[("Neon PostgreSQL")]
    RENDER_API --> LOGS["Render Deployment / Runtime Logs"]

    REPO["GitHub Repository"] --> ACTIONS["GitHub Actions"]
    ACTIONS --> VALIDATE["Validation Jobs"]
    ACTIONS --> COMPOSE["Compose Integration"]
    ACTIONS --> GHCR["GHCR Image Publishing"]
```

### Why Render and Neon?

The application was already deployed on Render as separate frontend and
backend services, with Neon providing managed PostgreSQL. For Day 24,
this working architecture was retained rather than provisioning a second
AWS deployment while AWS payment verification was blocking EC2 setup.

-   **Render:** managed frontend/backend hosting, public HTTPS and
    deployment/runtime logs.
-   **Neon:** managed PostgreSQL.
-   **GitHub Actions:** automated validation and container workflow.
-   **Docker Compose:** repeatable integration testing.

AWS EC2, IAM, S3, CloudWatch, load balancing and Auto Scaling were
studied as cloud infrastructure concepts. They are not represented as
live AWS resources for the current production deployment. The frontend
is React/Vite, so a separate Next.js/Vercel migration was not required.

## CI/CD and Git Workflow

``` mermaid
flowchart LR
    DEV["Developer Change"] --> BRANCH["Feature Branch"]
    BRANCH --> PR["Pull Request"]
    PR --> ACTIONS["GitHub Actions"]
    ACTIONS --> VALIDATE["Backend / Frontend Checks"]
    ACTIONS --> COMPOSE["Compose Integration"]
    ACTIONS --> IMAGE["GHCR Publishing"]
    VALIDATE --> MERGE["Review and Merge"]
    COMPOSE --> MERGE
    IMAGE --> MERGE
    MERGE --> DEPLOY["Hosted Deployment Workflow"]
```

The Day 23 DevOps hardening change was committed as `12de3dc`
(`feat(devops): harden containers and environment configuration`),
submitted through [PR
#1](https://github.com/abhinandanCS05/Coastal7_Learning_Internship/pull/1),
and merged into `day22-ai-application`. The recorded merged remote
commit was `dffea545cb071ca61eea407e2ab745f1433c1be4`.

## Daily Engineering Checklist

The following checklist summarises the programme milestones. It is an
engineering index, not a substitute for the detailed tracker entries.

  --------------------------------------------------------------------------------
                    Day Focus             Key outcome            Status
  --------------------- ----------------- ---------------------- -----------------
                     01 Python / FastAPI  Initial REST           Completed
                        foundations       endpoints, HTTP        
                                          methods, request       
                                          validation and Swagger 
                                          exploration            

                     02 Python core       Control flow,          Completed
                                          functions,             
                                          collections, JSON/CSV  
                                          and Contact Book CLI   

                     03 Object-oriented   Classes, inheritance,  Completed
                        programming       polymorphism,          
                                          abstraction and Bank   
                                          Account implementation 

                     04 SQL and           CLI Task Manager,      Completed
                        PostgreSQL        CRUD, parameterised    
                                          SQL, JSON export,      
                                          logging and tests      

                     05 FastAPI +         Pydantic models, ORM,  Completed
                        SQLAlchemy        database sessions,     
                                          migrations and CRUD    
                                          patterns               

                     06 Authentication    Password hashing, JWT  Completed
                        and security      flow, protected routes 
                                          and role-based access  
                                          patterns               

                     07 Task-management   Projects/tasks,        Completed
                        API               lifecycle state,       
                                          filtering, pagination  
                                          and CORS               

                     08 Async, Redis and  Async processing,      Completed
                        Celery            caching, rate-limiting 
                                          patterns, task state   
                                          and scheduling         

                     09 File processing   File validation, image Completed
                        and WebSockets    processing, real-time  
                                          events and             
                                          code-quality/testing   
                                          practices              

                     10 E-commerce        Product/cart/order     Completed
                        backend           workflows and backend  
                                          integration            

                     11 React frontend    Components, hooks,     Completed
                                          routing and            
                                          frontend/API           
                                          foundations            

                     12 UI systems and    Responsive styling,    Completed
                        forms             reusable UI, form      
                                          validation and         
                                          checkout patterns      

                     13 E-commerce        Catalogue browsing,    Completed
                        frontend          search/filter/sort,    
                                          detail views and admin 
                                          workflows              

                     14 State and server  Zustand, TanStack      Completed
                        data              Query, query caching   
                                          and pagination         
                                          patterns               

                     15 TypeScript and QA Typed contracts,       Completed
                                          Vitest and Playwright  
                                          testing patterns       

                     16 Frontend          Cart/checkout,         Completed
                        integration       order/admin workflows  
                                          and recorded           
                                          typecheck/build/test   
                                          validation             

                     17 Real-time         WebSocket lifecycle,   Completed
                        integration       live order updates and 
                                          reconnection handling  

                     18 Background jobs   Celery task            Completed
                        and search        integration, task      
                                          status, reports/bulk   
                                          processing and         
                                          PostgreSQL search      

                     19 Security and      API hardening,         Completed
                        performance       compression/rate       
                                          limiting patterns,     
                                          Locust testing and     
                                          database-pool          
                                          investigation          

                     20 AI, RAG and       Provider integration,  Completed
                        streaming         retrieval-grounded     
                                          assistance and         
                                          streaming responses    

                     21 AI features and   Generated product      Completed
                        tools             content, semantic      
                                          search, caching, rate  
                                          controls and bounded   
                                          tool-calling patterns  

                     22 AI-enhanced       Full-stack AI routes,  Completed
                        capstone          RAG/semantic search,   
                                          streaming and managed  
                                          deployment             

                     23 DevOps and CI/CD  Multi-stage Docker     Completed
                                          builds, Compose        
                                          integration,           
                                          environment hardening  
                                          and GitHub Actions     

                     24 Cloud operations  Render/Neon deployment Completed ---
                                          approach, HTTPS,       managed-hosting
                                          health/log review and  approach
                                          AWS infrastructure     
                                          fundamentals           

               Capstone Final integration Load testing,          Completed
                                          database-pool work,    
                                          production serving,    
                                          deployment evidence,   
                                          documentation and peer 
                                          review                 
  --------------------------------------------------------------------------------

## Security and Operational Notes

-   Never commit real `.env` values, database URLs, JWT secrets or
    provider API keys.
-   Do not expose PostgreSQL or Redis directly to the public internet.
-   Keep public frontend variables free of secrets; `VITE_` values are
    bundled into client assets.
-   Use HTTPS for public API traffic and secure WebSocket URLs where
    configured.
-   Use least-privilege permissions for cloud identities and deployment
    credentials.
-   Interpret load-test metrics in context: workload, latency,
    concurrency, test duration and error count all matter.
-   Keep operational logs and error messages free of credentials and
    sensitive user data.
-   Managed platform logs and health checks are not equivalent to a full
    Prometheus/Sentry/CloudWatch deployment; these tools represent
    distinct observability capabilities.

## Known Platform Decisions

  -----------------------------------------------------------------------
  Decision                            Rationale
  ----------------------------------- -----------------------------------
  Render for frontend and backend     Existing working deployment
                                      retained; no duplicate cloud
                                      deployment required

  Neon for PostgreSQL                 Managed relational persistence

  React/Vite rather than Next.js      Matches the actual frontend
                                      implementation

  Render-managed HTTPS rather than    TLS is handled by the hosting
  self-managed Nginx/Certbot          platform for the current deployment

  Docker Compose for integration      Repeatable multi-service validation

  GitHub Actions for CI               Automated validation and container
                                      publishing

  AWS topics studied rather than      AWS payment verification blocked
  provisioned                         EC2 setup; the live application
                                      remained on Render/Neon
  -----------------------------------------------------------------------

## Learning Outcomes

This programme provided hands-on experience in:

-   Python programming and object-oriented design.
-   REST API engineering with FastAPI and Pydantic.
-   SQL, PostgreSQL, SQLAlchemy, migrations and connection management.
-   Authentication, authorization and environment-based configuration.
-   Async programming, Redis, Celery and background jobs.
-   React/Vite frontend engineering, TypeScript, client/server state and
    forms.
-   WebSockets and real-time application workflows.
-   AI provider integration, streaming, RAG, semantic search and output
    validation.
-   Automated testing, containerization, GitHub Actions and deployment
    workflows.
-   Locust load testing, latency interpretation and connection-pool
    troubleshooting.
-   Managed cloud deployment decisions, operational logs, health checks
    and technical documentation.

## Maintainer and Credits

**Venkata Abhinandan Kancharla**\
B.Tech --- Artificial Intelligence & Machine Learning\
Knowledge Factory Internship Program 2026 · Batch 7\
Coastal Seven Technologies Private Limited

-   GitHub: [abhinandanCS05](https://github.com/abhinandanCS05)
-   Portfolio:
    [abhikancharla.vercel.app](https://abhikancharla.vercel.app)

------------------------------------------------------------------------

::: {align="center"}
**Built with purpose. Validated through iteration. Delivered with an
engineering mindset.**
:::

# Day 9 – File Uploads, WebSockets, Testing & Code Quality

## Overview

Day 9 focuses on building a tested and code-quality-compliant FastAPI application that combines secure image uploads, image processing, real-time WebSocket communication, automated testing, and Python code-quality tools.

The final application provides an image upload API that validates and resizes images using Pillow and sends a real-time notification to connected WebSocket clients whenever an image is uploaded.

## Day 9 Objectives

- Implement file uploads using FastAPI `UploadFile`
- Validate uploaded image files
- Resize and normalize images using Pillow
- Serve uploaded files through FastAPI
- Implement WebSocket communication
- Create a WebSocket connection manager
- Send real-time upload notifications
- Write automated tests using pytest
- Use TestClient for API testing
- Test WebSocket functionality
- Achieve 80%+ test coverage
- Configure Black, isort, Flake8, mypy, and pre-commit
- Integrate all features into one working FastAPI application

## Project Architecture

```text
Client
   |
   | POST /upload
   v
FastAPI UploadFile
   |
   +--> Extension Validation
   +--> MIME Type Validation
   +--> File Size Validation
   |
   v
Pillow Image Processing
   |
   +--> Verify Image
   +--> Resize Image
   +--> Convert to RGB
   +--> Save as JPEG
   |
   +--------------------+
   |                    |
   v                    v
uploads/          WebSocket Manager
                        |
                        v
                 Connected Clients
                        |
                        v
                Real-time Notification
```

## Project Structure

```text
Day_9_FileUpload_WebSocket_Testing/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── connection_manager.py
│   ├── image_service.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_api.py
├── docs/
│   └── API_TEST_CHECKLIST.md
├── uploads/
│   └── .gitkeep
├── client_websocket.py
├── requirements.txt
├── pyproject.toml
├── .flake8
├── .pre-commit-config.yaml
├── .gitignore
├── .env.example
└── README.md
```

## Technology Stack

| Technology | Purpose |
|---|---|
| FastAPI | REST API and WebSocket server |
| UploadFile | Multipart file upload handling |
| Pillow | Image validation, resizing and conversion |
| WebSocket | Real-time two-way communication |
| pytest | Automated testing |
| pytest-asyncio | Async testing support |
| TestClient | FastAPI endpoint testing |
| pytest-cov | Test coverage measurement |
| Black | Python code formatting |
| isort | Import organization |
| Flake8 | Code linting |
| mypy | Static type checking |
| pre-commit | Automated quality checks |

## API Endpoints

### 1. Health Check

```http
GET /health
```

Returns application health information.

### 2. Upload Image

```http
POST /upload
```

Accepts JPEG, PNG and WEBP images.

The endpoint performs:

1. Filename extension validation
2. MIME type validation
3. File-size validation
4. Actual image validation using Pillow
5. Image resizing
6. RGB normalization
7. JPEG conversion
8. Generated filename creation
9. File storage
10. WebSocket notification

Example response:

```json
{
  "message": "Image uploaded successfully",
  "file_url": "/static/generated-file.jpg",
  "filename": "generated-file.jpg",
  "original_filename": "photo.png",
  "size": 12345,
  "width": 1024,
  "height": 576
}
```

### 3. Static File Serving

```http
GET /static/{filename}
```

Serves the processed uploaded image.

### 4. File Access

```http
GET /files/{filename}
```

Returns the processed image file.

Missing files return `404 Not Found`.

## WebSocket

### Endpoint

```text
WS /ws
```

### Connection Event

```json
{
  "event": "connected",
  "message": "WebSocket connection established"
}
```

### Echo Communication

Client sends:

```text
Hello
```

Server responds:

```json
{
  "event": "echo",
  "message": "Hello"
}
```

### File Upload Notification

When an image is uploaded, connected WebSocket clients receive:

```json
{
  "event": "file_uploaded",
  "filename": "generated-file.jpg",
  "message": "New image uploaded: photo.png"
}
```

This provides the real-time notification functionality required for Day 9.

## Connection Manager

The `ConnectionManager` maintains active WebSocket connections.

Responsibilities:

- Accept new WebSocket connections
- Store active connections
- Remove disconnected clients
- Broadcast messages to connected clients

```text
WebSocket Client 1
        |
WebSocket Client 2 ----> ConnectionManager
        |                       |
WebSocket Client 3             |
                                v
                         Broadcast Message
```

## Image Processing

Pillow is used to process uploaded images.

### Validation

The application checks:

- Allowed file extension
- Allowed MIME type
- Maximum file size
- Actual image validity

### Resizing

Images are resized while maintaining their aspect ratio.

Maximum dimensions:

```text
1024 × 1024
```

### Output

Processed images are normalized and saved as JPEG files using generated filenames.

## Automated Testing

The project uses `pytest` and FastAPI's `TestClient`.

Tests cover:

- Health endpoint
- Valid image upload
- Image resizing
- Static/file access
- Missing file handling
- Invalid extension
- Invalid image content
- WebSocket connection
- WebSocket echo
- Real-time upload notification
- JPEG output validation
- Oversized file validation

Run:

```powershell
pytest
```

## Test Coverage

Final verified result:

```text
9 tests passed
93% total coverage
80%+ target
```

Generate a detailed coverage report:

```powershell
pytest --cov=app --cov-report=term-missing
```

Generate an HTML report:

```powershell
pytest --cov=app --cov-report=html
```

## Code Quality

### Black

```powershell
python -m black app tests
python -m black --check app tests
```

### isort

```powershell
python -m isort app tests
python -m isort --check-only app tests
```

### Flake8

```powershell
python -m flake8 app tests
```

### mypy

```powershell
python -m mypy app
```

The implementation uses explicit type annotations for the FastAPI lifespan and separates Pillow image-processing objects to maintain type-checking compatibility.

## Pre-commit

Pre-commit is configured to run:

```text
Black
isort
Flake8
mypy
```

Install:

```powershell
pre-commit install
```

Run all hooks:

```powershell
pre-commit run --all-files
```

## Running the Application

### Create virtual environment

```powershell
python -m venv .venv
```

### Activate

```powershell
.\.venv\Scripts\Activate.ps1
```

### Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### Start FastAPI

```powershell
python -m uvicorn app.main:app --reload
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## WebSocket Demo Client

Run the optional client in a second terminal:

```powershell
python client_websocket.py
```

Expected flow:

```text
Connected
    ↓
Echo message
    ↓
Waiting for upload notification
    ↓
Upload image through API
    ↓
Receive file_uploaded notification
```

## End-to-End Workflow

```text
1. Client uploads image
2. FastAPI receives UploadFile
3. Validate extension, MIME type and file size
4. Pillow verifies image
5. Image is resized and converted to RGB
6. Image is saved as generated JPEG
7. ConnectionManager broadcasts an event
8. Connected WebSocket clients receive file_uploaded
9. Automated tests verify behavior
10. Black, isort, Flake8 and mypy verify code quality
```

## Security Considerations

The implementation includes basic upload protections:

- Allowlisted image extensions
- MIME type validation
- Maximum upload size
- Actual image validation using Pillow
- Generated output filenames
- Uploaded files separated from application modules

This is an internship learning project and can be extended with additional production-level security controls when required.

## Day 9 Final Outcome

```text
File Upload
+
Image Validation
+
Pillow Processing
+
Static File Serving
+
WebSockets
+
Connection Manager
+
Real-Time Notifications
+
Automated Testing
+
93% Coverage
+
Black
+
isort
+
Flake8
+
mypy
+
pre-commit
```

This completes the Day 9 objective of building a real-time notification feature with file upload and WebSocket functionality on a tested and code-quality-checked FastAPI codebase.

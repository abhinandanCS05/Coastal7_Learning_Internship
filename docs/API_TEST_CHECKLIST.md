# Day 9 API & Review Checklist

## File Uploads
- [ ] POST /upload valid image
- [ ] Invalid extension -> 400
- [ ] Invalid image content -> 400
- [ ] Oversized file -> 413
- [ ] Pillow resize verified
- [ ] /static/{filename} serves image
- [ ] /files/{filename} works
- [ ] Missing file -> 404

## WebSockets
- [ ] Connect /ws
- [ ] connected event
- [ ] echo event
- [ ] upload triggers file_uploaded notification

## Testing
- [ ] pytest
- [ ] 80%+ coverage target
- [ ] pytest-asyncio configured
- [ ] TestClient used

## Code Quality
- [ ] black app tests
- [ ] isort app tests
- [ ] flake8 app tests
- [ ] mypy app
- [ ] pre-commit run --all-files

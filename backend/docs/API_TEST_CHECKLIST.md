# Day 10 API Test Checklist

## Authentication
- [ ] Register
- [ ] Duplicate registration -> 409
- [ ] Login -> Bearer token
- [ ] Invalid login -> 401
- [ ] Protected endpoint without token -> 401

## Products
- [ ] Create
- [ ] List
- [ ] Get
- [ ] Update
- [ ] Delete
- [ ] Product image upload

## Redis Cart
- [ ] Read cart
- [ ] Add item
- [ ] Reject excessive quantity
- [ ] Clear cart

## Orders
- [ ] Place order
- [ ] Validate stock
- [ ] Reduce stock
- [ ] Clear cart
- [ ] Queue Celery confirmation
- [ ] List orders
- [ ] Update status
- [ ] Reject invalid status

## WebSocket
- [ ] Connect with JWT
- [ ] Connected event
- [ ] Echo
- [ ] Order-status notification

## Quality
- [ ] pytest
- [ ] coverage
- [ ] black
- [ ] isort
- [ ] flake8
- [ ] mypy
- [ ] pre-commit

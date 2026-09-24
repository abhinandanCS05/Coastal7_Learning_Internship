# API Test Checklist

Authentication: register, duplicate register, valid/invalid login, /me, refresh token.
Projects: create, list with pagination, get, update, delete, ownership restriction.
Tasks: create, list, status filter, assignee filter, due-date filter, pagination, update, delete.
Workflow: TODO -> IN_PROGRESS -> DONE; invalid transitions rejected.
RBAC: normal users restricted to owned resources; admins can access all.
Errors: 401, 403, 404, 409, 422 scenarios.

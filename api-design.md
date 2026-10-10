# QuickNotes REST API Design Specification

## Base URL & Conventions
- **Base URL:** `https://api.quicknotes.com/v1`
- **Protocol:** HTTPS
- **Data Format:** JSON for all requests and responses.
- **Authentication:** Bearer token required in the `Authorization` header for protected endpoints.

---

## Endpoints Table

| Method | Path | Description | Success Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/notes` | Retrieve a paginated list of notes for the authenticated user. | `200 OK` |
| `GET` | `/notes/{id}` | Retrieve a single note by its unique ID. | `200 OK` |
| `POST` | `/notes` | Create a new note. | `201 Created` |
| `PATCH` | `/notes/{id}` | Partially update an existing note (title, body, tags). | `200 OK` |
| `DELETE` | `/notes/{id}` | Delete a specific note by ID. | `204 No Content` |
| `GET` | `/notes/search` | Search notes by query string or filter by tag. | `200 OK` |

---

## Request & Response Examples

### 1. Creating a Note (`POST /notes`)
* **Request Headers:**
  ```http
  Authorization: Bearer eyJhbGciOiJIUzI1Ni...
  Content-Type: application/json
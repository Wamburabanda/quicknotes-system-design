# QuickNotes - System Design (Project 2)
 
This repository contains the QuickNotes API client and the system design documents for scaling QuickNotes to 1 million users.
 
## API client
A small page that talks to the JSONPlaceholder practice API: it loads notes (GET), creates notes (POST) and deletes notes (DELETE).
 
## Design documents
- [API design](docs/api-design.md)
- [Data model](docs/data-model.md)
- [Architecture](docs/architecture.md)
 
## What I Learned
- How HTTP methods, status codes and JSON work together in a REST API
- How to use fetch with async/await, and why to check response.ok
- How to model users, notes and tags with primary and foreign keys
- Why caching, load balancers and read replicas help a read-heavy app
- That every design decision is a trade-off that should be explained
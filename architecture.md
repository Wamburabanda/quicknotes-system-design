# QuickNotes Architecture (1 Million Users)
 
## 1. Requirements
**Functional:** Sign up/login, CRUD operations, note search, cross-device sync.
**Non-functional:** <300ms load times, 99.9% availability, robust backups, strict tenant data isolation.
 
## 2. Load estimate
- 1,000,000 users, 20% daily active = 200,000 DAU.
- Writes: 200,000 × 5 notes = 1,000,000/day ≈ 10/s (peak ≈ 50/s).
- Reads: 200,000 × 20 loads = 4,000,000/day ≈ 40/s (peak ≈ 200/s).
- Storage: 1,000,000 notes/day × 500 bytes = 500 MB/day ≈ 180 GB/year.
 
## 3. Architecture diagram
    Client (browser / phone)
       │  1. DNS: api.quicknotes.com → load balancer IP
       ├──────────────> CDN  (index.html, style.css, script.js)
       │
       v  HTTPS + JSON
    Load balancer  (x2, active/standby)
       │
       ├──> App server 1 ──┐
       ├──> App server 2 ──┼──> Cache (Redis)
       └──> App server 3 ──┘
                    │
           writes   │ reads          jobs
                    v                v
    Primary DB ──replicates──> Read replica(s)     Queue ──> Worker
    (PostgreSQL)                                   (emails, exports)
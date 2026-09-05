# SWAGAT — Backend Prototype

Go/Gin backend implementing the generic tree engine, bubble-up admin routing,
and the real (goroutine-based) parallel dispatch + SLA/deemed-approval engine
described in `SWAGAT-System-Design.md`.

## Run it (one command)

```bash
docker compose up --build
```

This starts:
- `postgres` (16-alpine) with a health check
- `migrate` — applies `migrations/001_init.sql` once, then exits
- `backend` — the Go API on `:8080`

Check it's alive:
```bash
curl localhost:8080/healthz
```

## Run locally without Docker (for fast iteration)

```bash
# start just postgres
docker compose up -d postgres

# apply migrations
psql "postgres://swagat:swagat@localhost:5432/swagat?sslmode=disable" -f migrations/001_init.sql

# run the server
export DATABASE_URL="postgres://swagat:swagat@localhost:5432/swagat?sslmode=disable"
go run ./cmd/server
```

## Minimal end-to-end walkthrough (Flow A + Flow B)

```bash
# 1. Register a Super Admin
curl -X POST localhost:8080/auth/register -d '{
  "email":"admin@swagat.gov","password":"pass123","full_name":"Admin","role":"super_admin"
}' -H 'Content-Type: application/json'
# -> save the returned token as $ADMIN_TOKEN

# 2. Create a department + business type
curl -X POST localhost:8080/admin/departments -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Fire","sla_hours":48}' -H 'Content-Type: application/json'

curl -X POST localhost:8080/admin/business-types -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Hotel"}' -H 'Content-Type: application/json'

# 3. Create a document type owned by Fire
curl -X POST localhost:8080/admin/document-types -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Fire NOC","owning_department_id":"<fire-dept-id>","validity_days":365}' \
  -H 'Content-Type: application/json'

# 4. Import a business tree via JSON for one step (see Section 15 shape)
curl -X POST localhost:8080/admin/business-types/<business-type-id>/steps/business_registration/import \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d @tree.json

# 5. Import the Fire department's org tree
curl -X POST localhost:8080/admin/departments/<fire-dept-id>/org-tree/import \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d @org-tree.json

# 6. Register an applicant + department admin, walk the tree, upload docs,
#    approve them, submit -> watch dispatch fire per-department goroutines
#    and SLA timers in the backend logs.
```

## Project layout

```
cmd/server/main.go        entrypoint, route wiring
internal/db/               pgx connection pool
internal/models/           shared structs
internal/tree/              generic tree engine (CRUD, walk, JSON import) — reused for business + org trees
internal/routing/           bubble-up + least-pending-load admin routing (Section 10)
internal/dispatch/          per-department goroutines + SLA timers + deemed approval (Section 13/14)
internal/handlers/          HTTP handlers per role (super admin / applicant / dept admin)
migrations/001_init.sql     full Postgres schema
Dockerfile, docker-compose.yml   deployment
```

## Design notes / where this maps to the spec doc

- **One generic tree table** (`tree_nodes`) serves both the applicant business
  tree (`tree_type='business'`) and each department's org taxonomy
  (`tree_type='org'`) — Section 4/9.
- **Documents only ever attach to leaves** (`leaf_documents`), never
  intermediate nodes — Section 6/19#9.
- **Concurrency is real**: `dispatch.Engine.DispatchApplication` starts one
  goroutine per department bundle in a loop, each with its own SLA deadline
  computed from `departments.sla_hours` — not a shared/simulated timer.
- **Deemed approval** (Section 14) is triggered inside each bundle's own
  `watchSLA` goroutine when its private deadline passes — auto-approves any
  still-pending document in that bundle only.
- **Bubble-up routing** (Section 10) and **bundle re-routing on reupload**
  (Section 11) both live in `internal/routing`, reusing the same
  least-pending-load query at every level walked.
- **Once-Only vault** (Section 7) is enforced in `BuildChecklist` (checks
  vault before creating a fresh `application_documents` row) and in `Approve`
  (writes/refreshes the vault entry on every approval).

## Explicit scope cuts (see System Design doc, Section 23)

NATS (replaced by in-process goroutines), Kong/Apigee, real Aadhaar/DigiLocker/
PAN/e-Sign/Treasury APIs (all mocked at the handler boundary — `file_url` is
accepted as-is, no real verification call is made), payment/fee collection,
Joint Inspection Scheduler, Grievance Redressal, Incentives matching, analytics
dashboards, MeghRaj/K8s deployment, and monitoring stack are all **not**
implemented here — see the doc for why and where they'd plug in for v2.

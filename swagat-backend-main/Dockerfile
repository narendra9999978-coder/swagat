# --- build stage ---
FROM golang:1.22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum* ./
RUN go mod download 2>/dev/null || true

COPY . .
RUN go mod edit -replace github.com/rogpeppe/go-internal=github.com/rogpeppe/go-internal@v1.13.1
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o /swagat-server ./cmd/server
# --- runtime stage ---
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app

COPY --from=builder /swagat-server /app/swagat-server
COPY migrations /app/migrations

EXPOSE 8080

ENTRYPOINT ["/app/swagat-server"]

#!/bin/bash

set -e

COMMAND=$1

function run_backend() {
    echo "Starting backend..."
    cd backend/
    uv sync
    uv run uvicorn app:app --reload
}

function run_frontend() {
    echo "Starting frontend..."
    cd ui/
    npm install
    npm start
}

case $COMMAND in
    backend)
        run_backend
        ;;
    frontend)
        run_frontend "$@"
        ;;
    *)
        echo "Usage: $0 {backend|frontend} [-Y]"
        exit 1
        ;;
esac

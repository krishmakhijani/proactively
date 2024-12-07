#!/bin/bash

echo "Select your package manager:"
echo "1) npm"
echo "2) pnpm"
echo "3) yarn"
echo "4) bun"
read -p "Enter your choice (1/2/3/4): " choice

case $choice in
    1)
        PM="npm"
        ;;
    2)
        PM="pnpm"
        ;;
    3)
        PM="yarn"
        ;;
    4)
        PM="bun"
        ;;
    *)
        echo "Invalid choice. Defaulting to npm."
        PM="npm"
        ;;
esac

cd backend

$PM install

$PM run prisma generate

$PM prisma studio &

$PM run dev &

BACKEND_PID=$!

cd ../frontend

$PM install

$PM run dev &

FRONTEND_PID=$!

cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
}

trap cleanup EXIT

wait

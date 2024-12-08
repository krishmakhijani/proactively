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
PX="npx"
;;
2)
PM="pnpm"
PX="pnpx"
;;
3)
PM="yarn"
PX="yarn dlx"
;;
4)
PM="bun"
PX="bunx"
;;
*)
echo "⚠️ Invalid choice. Defaulting to npm."
PM="npm"
PX="npx"
;;
esac

echo "📦 Selected package manager: $PM"

cd backend
$PM install
$PX prisma generate

$PM run dev &
BACKEND_PID=$!

$PX prisma studio &
PRISMA_STUDIO_PID=$!

cd ../frontend
$PM install

$PM run dev &
FRONTEND_PID=$!

cleanup() {
    echo "🛑 Stopping servers..."
    echo "Terminating backend server..."
    kill $BACKEND_PID
    echo "Terminating Prisma Studio..."
    kill $PRISMA_STUDIO_PID
    echo "Terminating frontend server..."
    kill $FRONTEND_PID
    echo "All servers stopped. Goodbye! 👋"
}

trap cleanup EXIT

echo "🌐 Backend running on localhost:3000"
echo "🌐 Frontend running on localhost:3001"
echo "💾 Prisma Studio running on localhost:5555"

wait
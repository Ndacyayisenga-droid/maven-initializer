#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Maven Initializer Servers...${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven first.${NC}"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17+ first.${NC}"
    exit 1
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Start backend server
echo -e "${GREEN}🔧 Starting backend server (Spring Boot)...${NC}"
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo -e "${GREEN}🎨 Starting frontend server (Next.js)...${NC}"
npm run dev &
FRONTEND_PID=$!

echo -e "${BLUE}✅ Both servers are starting up!${NC}"
echo -e "${YELLOW}📱 Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}🔧 Backend: http://localhost:8080${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID

# Running Both Servers

This project includes scripts to run both the frontend (Next.js) and backend (Spring Boot) servers simultaneously.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **Java** (v17 or higher)
- **Maven** (v3.6 or higher)

## Available Scripts

### Option 1: Using npm scripts (Recommended)

```bash
# Run both servers using Node.js script (cross-platform)
npm run dev:all

# Run both servers using shell script (Unix/Linux/macOS)
npm run start:all
```

### Option 2: Direct execution

```bash
# Using Node.js script (cross-platform)
node run-servers.js

# Using shell script (Unix/Linux/macOS)
./run-servers.sh
```

### Option 3: Individual servers

```bash
# Run only the frontend server
npm run frontend

# Run only the backend server
npm run backend
```

## What the scripts do

1. **Check prerequisites** - Verify that Node.js, Java, and Maven are installed
2. **Install dependencies** - Automatically run `npm install` if `node_modules` doesn't exist
3. **Start backend server** - Run Spring Boot application on port 8080
4. **Start frontend server** - Run Next.js development server on port 3000
5. **Handle cleanup** - Properly shut down both servers when you press Ctrl+C

## Server URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## Stopping the servers

Press `Ctrl+C` in the terminal where the script is running. Both servers will be stopped gracefully.

## Troubleshooting

### Port already in use
If you get a "port already in use" error:
- Check if another instance is running: `lsof -i :3000` or `lsof -i :8080`
- Kill the process: `kill -9 <PID>`
- Or change the ports in the respective configuration files

### Java version issues
Make sure you're using Java 17 or higher:
```bash
java -version
```

### Maven issues
Make sure Maven is properly installed and in your PATH:
```bash
mvn -version
```

### Node.js issues
Make sure Node.js is properly installed:
```bash
node -version
npm -version
```

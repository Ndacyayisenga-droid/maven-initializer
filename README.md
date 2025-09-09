# Maven Initializer

A modern and easy-to-use web application for creating new Maven-based projects, inspired by tools like Spring Initializr. This project consists of a Next.js frontend and a Spring Boot Java backend.

## Features

*   **Project Metadata Configuration**: Define Group ID, Artifact ID, Version, Project Name, Description, Package Name, Packaging (JAR, WAR, POM), Java Version, and Maven Version.
*   **Dependency Management**: Searchable catalog of common Maven dependencies with categories.
*   **Real-time Validation**: Instant feedback on project configuration with visual indicators (icons and colors) for errors and warnings.
*   **Project Generation**: Generates a complete Maven project (including `pom.xml`, source files, tests, `README.md`, and `.gitignore`) as a downloadable ZIP file.
*   **Standard Maven Structure**: Ensures generated projects follow best practices for directory layout.

## Project Structure

The repository is divided into two main parts:

*   \`frontend/\`: Contains the Next.js application for the user interface.
*   \`backend/\`: Contains the Spring Boot Java application that handles project generation.

## Getting Started

Follow these steps to set up and run the Maven Initializer locally.

### Prerequisites

*   **Node.js** (LTS version recommended) and **npm** (or yarn/pnpm) for the frontend.
*   **Java Development Kit (JDK)** (version 17 or higher) for the backend.
*   **Apache Maven** (version 3.6.0 or higher) for the backend.

### 1. Backend Setup (Java Spring Boot)

The backend is responsible for generating the Maven project files and zipping them.

1.  **Navigate to the backend directory:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Build the Spring Boot application:**
    \`\`\`bash
    mvn clean install
    \`\`\`

3.  **Run the Spring Boot application:**
    \`\`\`bash
    mvn spring-boot:run
    \`\`\`
    The backend API will start on \`http://localhost:8080\`. You can verify it's running by visiting \`http://localhost:8080/api/health\` in your browser.

### 2. Frontend Setup (Next.js)

The frontend provides the user interface for configuring and downloading Maven projects.

1.  **Navigate to the frontend directory (in a new terminal window):**
    \`\`\`bash
    cd frontend
    \`\`\`

2.  **Install frontend dependencies:**
    \`\`\`bash
    npm install
    \`\`\`
    (or \`yarn install\` / \`pnpm install\`)

3.  **Run the Next.js development server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    The frontend application will be available at \`http://localhost:3000\`.

## Usage

1.  Ensure both the backend (Java Spring Boot) and frontend (Next.js) applications are running.
2.  Open your browser and navigate to \`http://localhost:3000\`.
3.  Fill in the project metadata (Group ID, Artifact ID, Version, etc.). Observe the real-time validation feedback on the input fields.
4.  Search for and select desired dependencies from the "Dependencies" section.
5.  Review your project configuration in the "Project Summary" sidebar.
6.  Click the "Generate Project" button. A ZIP file containing your new Maven project will be downloaded.
7.  You can then import this ZIP file into your favorite IDE (e.g., IntelliJ IDEA, VS Code with Java extensions, Eclipse) and start developing!

## Technologies Used

### Frontend
*   **Next.js**: React framework for building web applications.
*   **React**: JavaScript library for building user interfaces.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
*   **Zod**: TypeScript-first schema declaration and validation library.

### Backend
*   **Java**: Programming language.
*   **Spring Boot**: Framework for building production-ready Spring applications.
*   **Maven**: Build automation tool.
*   **Jackson**: High-performance JSON processor.
*   **JSZip (via Node.js API)**: Used for creating ZIP files (this was the previous implementation, now handled by Java's `java.util.zip`).

## Future Enhancements

*   **More Dependency Categories**: Expand the dependency catalog to include popular frameworks like Spring Boot, Jakarta EE, etc.
*   **Project Templates**: Offer predefined project templates (e.g., Web Application, REST API, Library).
*   **Advanced Maven Settings**: Allow configuration of more Maven plugins and properties.
*   **Maven Wrapper Support**: Include Maven Wrapper scripts in generated projects for consistent builds.
*   **Docker Support**: Generate Dockerfiles for easy containerization.
*   **CI/CD Templates**: Provide basic CI/CD pipeline configurations (e.g., GitHub Actions).
*   **Improved Validation UI**: More detailed tooltips, auto-fix suggestions.
*   **Project Preview**: Show a tree-view of the generated project structure before download.

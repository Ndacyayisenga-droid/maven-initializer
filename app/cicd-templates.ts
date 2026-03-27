export interface CICDTemplate {
  id: string
  name: string
  description: string
  platform: string
  content: string
  filename: string
}

export interface DockerTemplate {
  id: string
  name: string
  description: string
  baseImage: string
  content: string
  filename: string
}

export const dockerTemplates: DockerTemplate[] = [
  {
    id: "openjdk-17-alpine",
    name: "OpenJDK 17 Alpine",
    description: "Lightweight Alpine Linux with OpenJDK 17",
    baseImage: "openjdk:17-jdk-alpine",
    filename: "Dockerfile",
    content: `FROM openjdk:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]`
  },
  {
    id: "openjdk-17-slim",
    name: "OpenJDK 17 Slim",
    description: "Debian slim with OpenJDK 17",
    baseImage: "openjdk:17-jdk-slim",
    filename: "Dockerfile",
    content: `FROM openjdk:17-jdk-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]`
  },
  {
    id: "multi-stage",
    name: "Multi-stage Build",
    description: "Multi-stage Docker build for optimized image size",
    baseImage: "openjdk:17-jdk-alpine",
    filename: "Dockerfile",
    content: `# Build stage
FROM maven:3.9.6-openjdk-17-alpine AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]`
  }
]

export const cicdTemplates: CICDTemplate[] = [
  {
    id: "github-actions-basic",
    name: "GitHub Actions - Basic",
    description: "Basic CI/CD pipeline with build and test",
    platform: "GitHub Actions",
    filename: ".github/workflows/ci.yml",
    content: `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
        restore-keys: \${{ runner.os }}-m2
        
    - name: Build with Maven
      run: mvn clean compile
      
    - name: Run tests
      run: mvn test
      
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Maven Tests
        path: target/surefire-reports/*.xml
        reporter: java-junit`
  },
  {
    id: "github-actions-advanced",
    name: "GitHub Actions - Advanced",
    description: "Advanced CI/CD pipeline with security scanning and deployment",
    platform: "GitHub Actions",
    filename: ".github/workflows/ci-cd.yml",
    content: `name: Advanced CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  MAVEN_OPTS: -Xmx1024m

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
        restore-keys: \${{ runner.os }}-m2
        
    - name: Build with Maven
      run: mvn clean compile
      
    - name: Run tests
      run: mvn test
      
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Maven Tests
        path: target/surefire-reports/*.xml
        reporter: java-junit
        
    - name: Run integration tests
      run: mvn verify
      
    - name: Generate coverage report
      run: mvn jacoco:report
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: target/site/jacoco/jacoco.xml
        
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
        
    - name: Build Docker image
      if: github.ref == 'refs/heads/main'
      run: |
        docker build -t \${{ github.repository }}:\${{ github.sha }} .
        docker tag \${{ github.repository }}:\${{ github.sha }} \${{ github.repository }}:latest
        
    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: echo "Deploy to staging environment"
      
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: echo "Deploy to production environment"`
  },
  {
    id: "gitlab-ci",
    name: "GitLab CI/CD",
    description: "GitLab CI/CD pipeline configuration",
    platform: "GitLab CI",
    filename: ".gitlab-ci.yml",
    content: `stages:
  - build
  - test
  - security
  - deploy

variables:
  MAVEN_OPTS: "-Xmx1024m"
  MAVEN_CLI_OPTS: "--batch-mode --errors --fail-at-end --show-version"

cache:
  paths:
    - .m2/repository/

build:
  stage: build
  image: maven:3.9.6-openjdk-17
  script:
    - mvn clean compile
  artifacts:
    paths:
      - target/
    expire_in: 1 hour

test:
  stage: test
  image: maven:3.9.6-openjdk-17
  script:
    - mvn test
    - mvn verify
  artifacts:
    reports:
      junit:
        - target/surefire-reports/TEST-*.xml
      coverage_report:
        coverage_format: jacoco
        path: target/site/jacoco/jacoco.xml

security:
  stage: security
  image: maven:3.9.6-openjdk-17
  script:
    - mvn org.owasp:dependency-check-maven:check
  artifacts:
    reports:
      dependency_scanning:
        - target/dependency-check-report.html

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main`
  }
]

export const getDockerTemplateById = (id: string) => 
  dockerTemplates.find(t => t.id === id)

export const getCICDTemplateById = (id: string) => 
  cicdTemplates.find(t => t.id === id)

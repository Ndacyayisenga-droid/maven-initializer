export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  dependencies: string[]
  javaVersion: string
  packaging: string
  features: string[]
  icon: string
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "spring-boot-web",
    name: "Spring Boot Web Application",
    description: "A complete Spring Boot web application with REST API, database integration, and security",
    category: "Web Application",
    dependencies: [
      "spring-boot-starter-web",
      "spring-boot-starter-data-jpa",
      "spring-boot-starter-security",
      "spring-boot-starter-validation",
      "spring-boot-starter-test",
      "mysql-connector-j",
      "h2database",
      "lombok"
    ],
    javaVersion: "17",
    packaging: "jar",
    features: ["REST API", "Database", "Security", "Validation", "Testing"],
    icon: "🌐"
  },
  {
    id: "spring-boot-api",
    name: "Spring Boot REST API",
    description: "A lightweight REST API with Spring Boot, perfect for microservices",
    category: "REST API",
    dependencies: [
      "spring-boot-starter-web",
      "spring-boot-starter-data-jpa",
      "spring-boot-starter-validation",
      "spring-boot-starter-test",
      "h2database",
      "lombok",
      "jackson-databind"
    ],
    javaVersion: "17",
    packaging: "jar",
    features: ["REST API", "Database", "Validation", "Testing"],
    icon: "🚀"
  },
  {
    id: "spring-boot-microservice",
    name: "Spring Boot Microservice",
    description: "A production-ready microservice with monitoring, security, and testing",
    category: "Microservice",
    dependencies: [
      "spring-boot-starter-web",
      "spring-boot-starter-data-jpa",
      "spring-boot-starter-security",
      "spring-boot-starter-actuator",
      "spring-boot-starter-test",
      "mysql-connector-j",
      "lombok",
      "testcontainers"
    ],
    javaVersion: "17",
    packaging: "jar",
    features: ["REST API", "Database", "Security", "Monitoring", "Testing"],
    icon: "⚡"
  },
  {
    id: "java-library",
    name: "Java Library",
    description: "A reusable Java library with comprehensive testing and documentation",
    category: "Library",
    dependencies: [
      "junit-jupiter",
      "mockito-core",
      "assertj-core",
      "lombok",
      "guava"
    ],
    javaVersion: "17",
    packaging: "jar",
    features: ["Testing", "Documentation", "Utilities"],
    icon: "📚"
  },
  {
    id: "jakarta-web",
    name: "Jakarta EE Web Application",
    description: "A traditional Jakarta EE web application with servlets and JPA",
    category: "Web Application",
    dependencies: [
      "jakarta-servlet-api",
      "jakarta-persistence-api",
      "jakarta-validation-api",
      "hibernate-core",
      "mysql-connector-j",
      "slf4j-api",
      "logback-classic"
    ],
    javaVersion: "17",
    packaging: "war",
    features: ["Servlets", "JPA", "Validation", "Database"],
    icon: "🏛️"
  },
  {
    id: "reactive-spring",
    name: "Reactive Spring Application",
    description: "A reactive Spring WebFlux application with non-blocking I/O",
    category: "Reactive",
    dependencies: [
      "spring-webflux",
      "spring-boot-starter-data-redis",
      "spring-boot-starter-test",
      "lombok",
      "jackson-databind"
    ],
    javaVersion: "17",
    packaging: "jar",
    features: ["Reactive", "Non-blocking", "Redis", "Testing"],
    icon: "⚡"
  },
  {
    id: "testing-framework",
    name: "Testing Framework",
    description: "A comprehensive testing setup with JUnit, Mockito, and Testcontainers",
    category: "Testing",
    dependencies: [
      "junit-jupiter",
      "mockito-core",
      "assertj-core",
      "testcontainers",
      "spring-boot-starter-test"
    ],
    javaVersion: "17",
    packaging: "jar",
    features: ["Unit Testing", "Integration Testing", "Mocking", "Assertions"],
    icon: "🧪"
  }
]

export const templateCategories = Array.from(new Set(projectTemplates.map((t) => t.category)))

export const getTemplatesByCategory = (category: string) => 
  projectTemplates.filter((t) => t.category === category)

export const getTemplateById = (id: string) => 
  projectTemplates.find((t) => t.id === id)

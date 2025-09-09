export interface Dependency {
  id: string
  name: string
  description: string
  category: string
  groupId: string
  artifactId: string
  version: string
  tags?: string[]
  popular?: boolean
}

export const dependencies: Dependency[] = [
  // Spring Boot Framework
  {
    id: "spring-boot-starter-web",
    name: "Spring Boot Web",
    description: "Web applications with Spring Boot",
    category: "Spring Boot",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-web",
    version: "3.2.0",
    tags: ["web", "rest", "api"],
    popular: true,
  },
  {
    id: "spring-boot-starter-data-jpa",
    name: "Spring Boot Data JPA",
    description: "JPA with Spring Data",
    category: "Spring Boot",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-data-jpa",
    version: "3.2.0",
    tags: ["database", "jpa", "orm"],
    popular: true,
  },
  {
    id: "spring-boot-starter-security",
    name: "Spring Boot Security",
    description: "Authentication and authorization",
    category: "Spring Boot",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-security",
    version: "3.2.0",
    tags: ["security", "auth"],
    popular: true,
  },
  {
    id: "spring-boot-starter-validation",
    name: "Spring Boot Validation",
    description: "Bean validation with Hibernate Validator",
    category: "Spring Boot",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-validation",
    version: "3.2.0",
    tags: ["validation"],
  },
  {
    id: "spring-boot-starter-test",
    name: "Spring Boot Test",
    description: "Testing with Spring Boot",
    category: "Spring Boot",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-test",
    version: "3.2.0",
    tags: ["testing"],
    popular: true,
  },

  // Jakarta EE
  {
    id: "jakarta-servlet-api",
    name: "Jakarta Servlet API",
    description: "Jakarta Servlet specification",
    category: "Jakarta EE",
    groupId: "jakarta.servlet",
    artifactId: "jakarta.servlet-api",
    version: "6.0.0",
    tags: ["servlet", "web"],
  },
  {
    id: "jakarta-persistence-api",
    name: "Jakarta Persistence API",
    description: "Jakarta Persistence specification",
    category: "Jakarta EE",
    groupId: "jakarta.persistence",
    artifactId: "jakarta.persistence-api",
    version: "3.1.0",
    tags: ["jpa", "persistence"],
  },
  {
    id: "jakarta-validation-api",
    name: "Jakarta Validation API",
    description: "Jakarta Bean Validation specification",
    category: "Jakarta EE",
    groupId: "jakarta.validation",
    artifactId: "jakarta.validation-api",
    version: "3.0.2",
    tags: ["validation"],
  },

  // Web Frameworks
  {
    id: "spring-webmvc",
    name: "Spring Web MVC",
    description: "Spring Web MVC framework",
    category: "Web Frameworks",
    groupId: "org.springframework",
    artifactId: "spring-webmvc",
    version: "6.1.1",
    tags: ["web", "mvc"],
  },
  {
    id: "spring-webflux",
    name: "Spring WebFlux",
    description: "Reactive web framework",
    category: "Web Frameworks",
    groupId: "org.springframework",
    artifactId: "spring-webflux",
    version: "6.1.1",
    tags: ["reactive", "web"],
  },
  {
    id: "javax-servlet-api",
    name: "Java Servlet API",
    description: "Java Servlet specification",
    category: "Web Frameworks",
    groupId: "javax.servlet",
    artifactId: "javax.servlet-api",
    version: "4.0.1",
    tags: ["servlet", "web"],
  },

  // Database
  {
    id: "hibernate-core",
    name: "Hibernate Core",
    description: "Hibernate ORM framework",
    category: "Database",
    groupId: "org.hibernate.orm",
    artifactId: "hibernate-core",
    version: "6.3.1.Final",
    tags: ["orm", "jpa"],
    popular: true,
  },
  {
    id: "mysql-connector-j",
    name: "MySQL Connector",
    description: "MySQL JDBC driver",
    category: "Database",
    groupId: "com.mysql",
    artifactId: "mysql-connector-j",
    version: "8.1.0",
    tags: ["database", "mysql"],
    popular: true,
  },
  {
    id: "postgresql",
    name: "PostgreSQL Driver",
    description: "PostgreSQL JDBC driver",
    category: "Database",
    groupId: "org.postgresql",
    artifactId: "postgresql",
    version: "42.7.1",
    tags: ["database", "postgresql"],
  },
  {
    id: "h2database",
    name: "H2 Database",
    description: "In-memory database",
    category: "Database",
    groupId: "com.h2database",
    artifactId: "h2",
    version: "2.2.224",
    tags: ["database", "in-memory"],
  },
  {
    id: "spring-boot-starter-data-redis",
    name: "Spring Data Redis",
    description: "Redis integration with Spring Data",
    category: "Database",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-data-redis",
    version: "3.2.0",
    tags: ["redis", "cache"],
  },

  // Testing
  {
    id: "junit-jupiter",
    name: "JUnit 5",
    description: "Unit testing framework",
    category: "Testing",
    groupId: "org.junit.jupiter",
    artifactId: "junit-jupiter",
    version: "5.10.0",
    tags: ["testing", "unit"],
    popular: true,
  },
  {
    id: "mockito-core",
    name: "Mockito",
    description: "Mocking framework",
    category: "Testing",
    groupId: "org.mockito",
    artifactId: "mockito-core",
    version: "5.5.0",
    tags: ["testing", "mocking"],
    popular: true,
  },
  {
    id: "testcontainers",
    name: "Testcontainers",
    description: "Integration testing with containers",
    category: "Testing",
    groupId: "org.testcontainers",
    artifactId: "junit-jupiter",
    version: "1.19.3",
    tags: ["testing", "integration"],
  },
  {
    id: "assertj-core",
    name: "AssertJ",
    description: "Fluent assertions for Java",
    category: "Testing",
    groupId: "org.assertj",
    artifactId: "assertj-core",
    version: "3.24.2",
    tags: ["testing", "assertions"],
  },

  // JSON Processing
  {
    id: "jackson-databind",
    name: "Jackson Databind",
    description: "JSON processing library",
    category: "JSON",
    groupId: "com.fasterxml.jackson.core",
    artifactId: "jackson-databind",
    version: "2.15.2",
    tags: ["json", "serialization"],
    popular: true,
  },
  {
    id: "gson",
    name: "Gson",
    description: "JSON serialization library",
    category: "JSON",
    groupId: "com.google.code.gson",
    artifactId: "gson",
    version: "2.10.1",
    tags: ["json", "google"],
  },
  {
    id: "jackson-datatype-jsr310",
    name: "Jackson JSR310",
    description: "Java 8 time support for Jackson",
    category: "JSON",
    groupId: "com.fasterxml.jackson.datatype",
    artifactId: "jackson-datatype-jsr310",
    version: "2.15.2",
    tags: ["json", "time"],
  },

  // Logging
  {
    id: "slf4j-api",
    name: "SLF4J",
    description: "Logging facade",
    category: "Logging",
    groupId: "org.slf4j",
    artifactId: "slf4j-api",
    version: "2.0.9",
    tags: ["logging", "facade"],
    popular: true,
  },
  {
    id: "logback-classic",
    name: "Logback",
    description: "Logging implementation",
    category: "Logging",
    groupId: "ch.qos.logback",
    artifactId: "logback-classic",
    version: "1.4.11",
    tags: ["logging", "implementation"],
    popular: true,
  },
  {
    id: "log4j-core",
    name: "Log4j2",
    description: "Log4j 2 logging framework",
    category: "Logging",
    groupId: "org.apache.logging.log4j",
    artifactId: "log4j-core",
    version: "2.21.1",
    tags: ["logging", "apache"],
  },

  // Utilities
  {
    id: "commons-lang3",
    name: "Apache Commons Lang",
    description: "Utility classes",
    category: "Utilities",
    groupId: "org.apache.commons",
    artifactId: "commons-lang3",
    version: "3.13.0",
    tags: ["utilities", "apache"],
  },
  {
    id: "guava",
    name: "Google Guava",
    description: "Core libraries",
    category: "Utilities",
    groupId: "com.google.guava",
    artifactId: "guava",
    version: "32.1.2-jre",
    tags: ["utilities", "google"],
    popular: true,
  },
  {
    id: "lombok",
    name: "Lombok",
    description: "Code generation library",
    category: "Utilities",
    groupId: "org.projectlombok",
    artifactId: "lombok",
    version: "1.18.30",
    tags: ["code-generation", "boilerplate"],
    popular: true,
  },
  {
    id: "mapstruct",
    name: "MapStruct",
    description: "Bean mapping library",
    category: "Utilities",
    groupId: "org.mapstruct",
    artifactId: "mapstruct",
    version: "1.5.5.Final",
    tags: ["mapping", "dto"],
  },

  // Security
  {
    id: "spring-security-core",
    name: "Spring Security Core",
    description: "Spring Security framework",
    category: "Security",
    groupId: "org.springframework.security",
    artifactId: "spring-security-core",
    version: "6.1.1",
    tags: ["security", "spring"],
  },
  {
    id: "jwt",
    name: "JWT",
    description: "JSON Web Token library",
    category: "Security",
    groupId: "io.jsonwebtoken",
    artifactId: "jjwt-api",
    version: "0.12.3",
    tags: ["jwt", "token"],
  },

  // Monitoring & Metrics
  {
    id: "spring-boot-starter-actuator",
    name: "Spring Boot Actuator",
    description: "Production-ready features",
    category: "Monitoring",
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-starter-actuator",
    version: "3.2.0",
    tags: ["monitoring", "health"],
  },
  {
    id: "micrometer-core",
    name: "Micrometer",
    description: "Application metrics",
    category: "Monitoring",
    groupId: "io.micrometer",
    artifactId: "micrometer-core",
    version: "1.12.0",
    tags: ["metrics", "monitoring"],
  },

  // Build Tools
  {
    id: "maven-compiler-plugin",
    name: "Maven Compiler Plugin",
    description: "Maven compiler plugin",
    category: "Build Tools",
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-compiler-plugin",
    version: "3.11.0",
    tags: ["maven", "compiler"],
  },
  {
    id: "maven-surefire-plugin",
    name: "Maven Surefire Plugin",
    description: "Maven test execution plugin",
    category: "Build Tools",
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-surefire-plugin",
    version: "3.1.2",
    tags: ["maven", "testing"],
  },
]

export const categories = Array.from(new Set(dependencies.map((d) => d.category))).sort()

export const popularDependencies = dependencies.filter((d) => d.popular)

export const getDependenciesByCategory = (category: string) => 
  dependencies.filter((d) => d.category === category)

export const searchDependencies = (query: string) => 
  dependencies.filter((d) => 
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.description.toLowerCase().includes(query.toLowerCase()) ||
    d.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  )

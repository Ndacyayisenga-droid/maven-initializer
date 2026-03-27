package com.maven.initializer.service;

import com.maven.initializer.model.Dependency;
import com.maven.initializer.model.ProjectConfig;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class EnhancedProjectGeneratorService {

    public byte[] generateProject(ProjectConfig config) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            // Generate pom.xml
            addFileToZip(zos, "pom.xml", generatePomXml(config));
            
            // Generate README.md
            addFileToZip(zos, "README.md", generateReadme(config));
            
            // Generate .gitignore
            addFileToZip(zos, ".gitignore", generateGitignore());
            
            // Generate Maven Wrapper
            generateMavenWrapper(zos);
            
            // Create directory structure and add main Java class
            String packagePath = config.getPackageName().replace(".", "/");
            String mainClassName = generateClassName(config.getArtifactId()) + "Application.java";
            addFileToZip(zos, "src/main/java/" + packagePath + "/" + mainClassName, 
                        generateMainClass(config));
            
            // Add test Java class
            String testClassName = generateClassName(config.getArtifactId()) + "ApplicationTest.java";
            addFileToZip(zos, "src/test/java/" + packagePath + "/" + testClassName, 
                        generateTestClass(config));
            
            // Add application properties
            addFileToZip(zos, "src/main/resources/application.properties", 
                        generateApplicationProperties(config));
            
            // Add empty resources directories
            addFileToZip(zos, "src/main/resources/.gitkeep", "");
            addFileToZip(zos, "src/test/resources/.gitkeep", "");
            
            // Generate Docker files if requested
            if (config.getDockerTemplate() != null && !config.getDockerTemplate().isEmpty()) {
                generateDockerFiles(zos, config);
            }
            
            // Generate CI/CD files if requested
            if (config.getCicdTemplate() != null && !config.getCicdTemplate().isEmpty()) {
                generateCICDFiles(zos, config);
            }
        }
        
        return baos.toByteArray();
    }

    private void addFileToZip(ZipOutputStream zos, String fileName, String content) throws IOException {
        ZipEntry entry = new ZipEntry(fileName);
        zos.putNextEntry(entry);
        zos.write(content.getBytes("UTF-8"));
        zos.closeEntry();
    }

    private String generateClassName(String artifactId) {
        return Arrays.stream(artifactId.split("-"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1))
                .collect(Collectors.joining(""));
    }

    private void generateMavenWrapper(ZipOutputStream zos) throws IOException {
        // Maven Wrapper JAR (placeholder - in real implementation, you'd include the actual wrapper JAR)
        addFileToZip(zos, ".mvn/wrapper/maven-wrapper.jar", "");
        
        // Maven Wrapper Properties
        String wrapperProperties = "distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip\n" +
                "wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar";
        addFileToZip(zos, ".mvn/wrapper/maven-wrapper.properties", wrapperProperties);
        
        // Maven Wrapper Scripts
        String mvnw = "#!/bin/sh\n" +
                "# Maven Wrapper Script\n" +
                "MAVEN_PROJECTBASEDIR=\"${MAVEN_BASEDIR:-$MAVEN_PROJECTBASEDIR}\"\n" +
                "MAVEN_OPTS=\"${MAVEN_OPTS:-$MAVEN_OPTS}\"\n" +
                "MAVEN_DEBUG_OPTS=\"${MAVEN_DEBUG_OPTS:-$MAVEN_DEBUG_OPTS}\"\n" +
                "MAVEN_DAEMON_OPTS=\"${MAVEN_DAEMON_OPTS:-$MAVEN_DAEMON_OPTS}\"\n" +
                "MAVEN_TERMINATE_OPTS=\"${MAVEN_TERMINATE_OPTS:-$MAVEN_TERMINATE_OPTS}\"\n" +
                "MAVEN_OPTS=\"$MAVEN_OPTS $MAVEN_DEBUG_OPTS $MAVEN_DAEMON_OPTS $MAVEN_TERMINATE_OPTS\"\n" +
                "exec \"$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar\" \"$@\"";
        addFileToZip(zos, "mvnw", mvnw);
        
        String mvnwCmd = "@REM Maven Wrapper Script for Windows\n" +
                "@echo off\n" +
                "set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%\n" +
                "set MAVEN_OPTS=%MAVEN_OPTS%\n" +
                "set MAVEN_DEBUG_OPTS=%MAVEN_DEBUG_OPTS%\n" +
                "set MAVEN_DAEMON_OPTS=%MAVEN_DAEMON_OPTS%\n" +
                "set MAVEN_TERMINATE_OPTS=%MAVEN_TERMINATE_OPTS%\n" +
                "set MAVEN_OPTS=%MAVEN_OPTS% %MAVEN_DEBUG_OPTS% %MAVEN_DAEMON_OPTS% %MAVEN_TERMINATE_OPTS%\n" +
                "java -jar \"%MAVEN_PROJECTBASEDIR%\\.mvn\\wrapper\\maven-wrapper.jar\" %*";
        addFileToZip(zos, "mvnw.cmd", mvnwCmd);
    }

    private void generateDockerFiles(ZipOutputStream zos, ProjectConfig config) throws IOException {
        String dockerfile = generateDockerfile(config);
        addFileToZip(zos, "Dockerfile", dockerfile);
        
        // Add .dockerignore
        String dockerignore = "target/\n" +
                ".mvn/\n" +
                "mvnw\n" +
                "mvnw.cmd\n" +
                ".git/\n" +
                ".gitignore\n" +
                "README.md\n" +
                ".idea/\n" +
                "*.iml\n" +
                ".vscode/\n" +
                ".DS_Store";
        addFileToZip(zos, ".dockerignore", dockerignore);
    }

    private void generateCICDFiles(ZipOutputStream zos, ProjectConfig config) throws IOException {
        if ("github-actions-basic".equals(config.getCicdTemplate()) || 
            "github-actions-advanced".equals(config.getCicdTemplate())) {
            String workflow = generateGitHubActionsWorkflow(config);
            addFileToZip(zos, ".github/workflows/ci.yml", workflow);
        } else if ("gitlab-ci".equals(config.getCicdTemplate())) {
            String gitlabCi = generateGitLabCI(config);
            addFileToZip(zos, ".gitlab-ci.yml", gitlabCi);
        }
    }

    private String generateDockerfile(ProjectConfig config) {
        if ("openjdk-17-alpine".equals(config.getDockerTemplate())) {
            return "FROM openjdk:17-jdk-alpine\n\n" +
                   "WORKDIR /app\n\n" +
                   "COPY target/*.jar app.jar\n\n" +
                   "EXPOSE 8080\n\n" +
                   "HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\\\n" +
                   "  CMD curl -f http://localhost:8080/actuator/health || exit 1\n\n" +
                   "ENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]";
        } else if ("multi-stage".equals(config.getDockerTemplate())) {
            return "FROM maven:3.9.6-openjdk-17-alpine AS build\n\n" +
                   "WORKDIR /app\n\n" +
                   "COPY pom.xml .\n" +
                   "RUN mvn dependency:go-offline -B\n\n" +
                   "COPY src ./src\n" +
                   "RUN mvn clean package -DskipTests\n\n" +
                   "FROM openjdk:17-jdk-alpine\n\n" +
                   "RUN apk add --no-cache curl\n\n" +
                   "WORKDIR /app\n\n" +
                   "COPY --from=build /app/target/*.jar app.jar\n\n" +
                   "EXPOSE 8080\n\n" +
                   "HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\\\n" +
                   "  CMD curl -f http://localhost:8080/actuator/health || exit 1\n\n" +
                   "ENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]";
        }
        return "FROM openjdk:17-jdk-slim\n\n" +
               "RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*\n\n" +
               "WORKDIR /app\n\n" +
               "COPY target/*.jar app.jar\n\n" +
               "EXPOSE 8080\n\n" +
               "HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\\\n" +
               "  CMD curl -f http://localhost:8080/actuator/health || exit 1\n\n" +
               "ENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]";
    }

    private String generateGitHubActionsWorkflow(ProjectConfig config) {
        if ("github-actions-advanced".equals(config.getCicdTemplate())) {
            return "name: Advanced CI/CD Pipeline\n\n" +
                   "on:\n" +
                   "  push:\n" +
                   "    branches: [ main, develop ]\n" +
                   "  pull_request:\n" +
                   "    branches: [ main ]\n\n" +
                   "env:\n" +
                   "  MAVEN_OPTS: -Xmx1024m\n\n" +
                   "jobs:\n" +
                   "  build:\n" +
                   "    runs-on: ubuntu-latest\n" +
                   "    steps:\n" +
                   "    - uses: actions/checkout@v4\n" +
                   "    - name: Set up JDK 17\n" +
                   "      uses: actions/setup-java@v4\n" +
                   "      with:\n" +
                   "        java-version: '17'\n" +
                   "        distribution: 'temurin'\n" +
                   "    - name: Cache Maven dependencies\n" +
                   "      uses: actions/cache@v3\n" +
                   "      with:\n" +
                   "        path: ~/.m2\n" +
                   "        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}\n" +
                   "    - name: Build with Maven\n" +
                   "      run: mvn clean compile\n" +
                   "    - name: Run tests\n" +
                   "      run: mvn test\n" +
                   "    - name: Build Docker image\n" +
                   "      if: github.ref == 'refs/heads/main'\n" +
                   "      run: docker build -t ${{ github.repository }}:${{ github.sha }} .";
        }
        
        return "name: CI/CD Pipeline\n\n" +
               "on:\n" +
               "  push:\n" +
               "    branches: [ main, develop ]\n" +
               "  pull_request:\n" +
               "    branches: [ main ]\n\n" +
               "jobs:\n" +
               "  build:\n" +
               "    runs-on: ubuntu-latest\n" +
               "    steps:\n" +
               "    - uses: actions/checkout@v4\n" +
               "    - name: Set up JDK 17\n" +
               "      uses: actions/setup-java@v4\n" +
               "      with:\n" +
               "        java-version: '17'\n" +
               "        distribution: 'temurin'\n" +
               "    - name: Cache Maven dependencies\n" +
               "      uses: actions/cache@v3\n" +
               "      with:\n" +
               "        path: ~/.m2\n" +
               "        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}\n" +
               "    - name: Build with Maven\n" +
               "      run: mvn clean compile\n" +
               "    - name: Run tests\n" +
               "      run: mvn test";
    }

    private String generateGitLabCI(ProjectConfig config) {
        return "stages:\n" +
               "  - build\n" +
               "  - test\n" +
               "  - deploy\n\n" +
               "variables:\n" +
               "  MAVEN_OPTS: \"-Xmx1024m\"\n" +
               "  MAVEN_CLI_OPTS: \"--batch-mode --errors --fail-at-end --show-version\"\n\n" +
               "cache:\n" +
               "  paths:\n" +
               "    - .m2/repository/\n\n" +
               "build:\n" +
               "  stage: build\n" +
               "  image: maven:3.9.6-openjdk-17\n" +
               "  script:\n" +
               "    - mvn clean compile\n" +
               "  artifacts:\n" +
               "    paths:\n" +
               "      - target/\n" +
               "    expire_in: 1 hour\n\n" +
               "test:\n" +
               "  stage: test\n" +
               "  image: maven:3.9.6-openjdk-17\n" +
               "  script:\n" +
               "    - mvn test\n" +
               "    - mvn verify\n" +
               "  artifacts:\n" +
               "    reports:\n" +
               "      junit:\n" +
               "        - target/surefire-reports/TEST-*.xml";
    }

    private String generateApplicationProperties(ProjectConfig config) {
        StringBuilder props = new StringBuilder();
        props.append("# Application Configuration\n");
        props.append("server.port=8080\n\n");
        
        // Add Spring Boot specific properties if Spring Boot dependencies are present
        boolean hasSpringBoot = config.getDependencies() != null && 
            config.getDependencies().stream()
                .anyMatch(dep -> dep.getGroupId().contains("springframework.boot"));
        
        if (hasSpringBoot) {
            props.append("# Spring Boot Configuration\n");
            props.append("spring.application.name=").append(config.getArtifactId()).append("\n\n");
            props.append("# Logging Configuration\n");
            props.append("logging.level.com.").append(config.getGroupId().replace(".", ".")).append("=INFO\n");
            props.append("logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n\n\n");
        }
        
        return props.toString();
    }

    private String generatePomXml(ProjectConfig config) {
        StringBuilder dependenciesXml = new StringBuilder();
        
        if (config.getDependencies() != null) {
            for (Dependency dep : config.getDependencies()) {
                dependenciesXml.append(String.format(
                    "        <dependency>\n" +
                    "            <groupId>%s</groupId>\n" +
                    "            <artifactId>%s</artifactId>\n" +
                    "            <version>%s</version>\n" +
                    "        </dependency>\n",
                    dep.getGroupId(), dep.getArtifactId(), dep.getVersion()
                ));
            }
        }

        StringBuilder pluginsXml = new StringBuilder();
        
        // Add Spring Boot plugin if Spring Boot dependencies are present
        boolean hasSpringBoot = config.getDependencies() != null && 
            config.getDependencies().stream()
                .anyMatch(dep -> dep.getGroupId().contains("springframework.boot"));
        
        if (hasSpringBoot) {
            pluginsXml.append("            <plugin>\n" +
                "                <groupId>org.springframework.boot</groupId>\n" +
                "                <artifactId>spring-boot-maven-plugin</artifactId>\n" +
                "                <version>3.2.0</version>\n" +
                "                <configuration>\n" +
                "                    <executable>true</executable>\n" +
                "                </configuration>\n" +
                "                <executions>\n" +
                "                    <execution>\n" +
                "                        <goals>\n" +
                "                            <goal>repackage</goal>\n" +
                "                        </goals>\n" +
                "                    </execution>\n" +
                "                </executions>\n" +
                "            </plugin>\n");
        }

        return String.format(
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<project xmlns=\"http://maven.apache.org/POM/4.0.0\"\n" +
            "         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
            "         xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 \n" +
            "         http://maven.apache.org/xsd/maven-4.0.0.xsd\">\n" +
            "    <modelVersion>4.0.0</modelVersion>\n\n" +
            "    <groupId>%s</groupId>\n" +
            "    <artifactId>%s</artifactId>\n" +
            "    <version>%s</version>\n" +
            "    <packaging>%s</packaging>\n\n" +
            "    <name>%s</name>\n" +
            "    <description>%s</description>\n\n" +
            "    <properties>\n" +
            "        <maven.compiler.source>%s</maven.compiler.source>\n" +
            "        <maven.compiler.target>%s</maven.compiler.target>\n" +
            "        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>\n" +
            "        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>\n" +
            "    </properties>\n\n" +
            "    <dependencies>\n%s" +
            "    </dependencies>\n\n" +
            "    <build>\n" +
            "        <plugins>\n" +
            "            <plugin>\n" +
            "                <groupId>org.apache.maven.plugins</groupId>\n" +
            "                <artifactId>maven-compiler-plugin</artifactId>\n" +
            "                <version>3.11.0</version>\n" +
            "                <configuration>\n" +
            "                    <source>%s</source>\n" +
            "                    <target>%s</target>\n" +
            "                </configuration>\n" +
            "            </plugin>\n" +
            "            <plugin>\n" +
            "                <groupId>org.apache.maven.plugins</groupId>\n" +
            "                <artifactId>maven-surefire-plugin</artifactId>\n" +
            "                <version>3.1.2</version>\n" +
            "                <configuration>\n" +
            "                    <useSystemClassLoader>false</useSystemClassLoader>\n" +
            "                </configuration>\n" +
            "            </plugin>\n%s" +
            "        </plugins>\n" +
            "    </build>\n" +
            "</project>",
            config.getGroupId(),
            config.getArtifactId(),
            config.getVersion(),
            config.getPackaging(),
            config.getName() != null && !config.getName().isEmpty() ? config.getName() : config.getArtifactId(),
            config.getDescription() != null && !config.getDescription().isEmpty() ? 
                config.getDescription() : "A Maven project generated by Maven Initializer",
            config.getJavaVersion(),
            config.getJavaVersion(),
            dependenciesXml.toString(),
            config.getJavaVersion(),
            config.getJavaVersion(),
            pluginsXml.toString()
        );
    }

    private String generateMainClass(ProjectConfig config) {
        String className = generateClassName(config.getArtifactId());
        boolean hasSpringBoot = config.getDependencies() != null && 
            config.getDependencies().stream()
                .anyMatch(dep -> dep.getGroupId().contains("springframework.boot"));
        
        if (hasSpringBoot) {
            return String.format(
                "package %s;\n\n" +
                "import org.springframework.boot.SpringApplication;\n" +
                "import org.springframework.boot.autoconfigure.SpringBootApplication;\n\n" +
                "/**\n" +
                " * Main class for %s\n" +
                " * %s\n" +
                " */\n" +
                "@SpringBootApplication\n" +
                "public class %sApplication {\n" +
                "    public static void main(String[] args) {\n" +
                "        SpringApplication.run(%sApplication.class, args);\n" +
                "    }\n" +
                "}",
                config.getPackageName(),
                config.getName() != null && !config.getName().isEmpty() ? config.getName() : config.getArtifactId(),
                config.getDescription() != null && !config.getDescription().isEmpty() ? 
                    config.getDescription() : "Generated by Maven Initializer",
                className,
                className
            );
        } else {
            return String.format(
                "package %s;\n\n" +
                "/**\n" +
                " * Main class for %s\n" +
                " * %s\n" +
                " */\n" +
                "public class %sApplication {\n" +
                "    public static void main(String[] args) {\n" +
                "        System.out.println(\"Hello from %s!\");\n" +
                "    }\n" +
                "}",
                config.getPackageName(),
                config.getName() != null && !config.getName().isEmpty() ? config.getName() : config.getArtifactId(),
                config.getDescription() != null && !config.getDescription().isEmpty() ? 
                    config.getDescription() : "Generated by Maven Initializer",
                className,
                config.getName() != null && !config.getName().isEmpty() ? config.getName() : config.getArtifactId()
            );
        }
    }

    private String generateTestClass(ProjectConfig config) {
        String className = generateClassName(config.getArtifactId());
        boolean hasJUnit = config.getDependencies() != null && 
            config.getDependencies().stream()
                .anyMatch(dep -> "org.junit.jupiter".equals(dep.getGroupId()));
        boolean hasSpringBoot = config.getDependencies() != null && 
            config.getDependencies().stream()
                .anyMatch(dep -> dep.getGroupId().contains("springframework.boot"));

        if (hasSpringBoot && hasJUnit) {
            return String.format(
                "package %s;\n\n" +
                "import org.junit.jupiter.api.Test;\n" +
                "import org.springframework.boot.test.context.SpringBootTest;\n" +
                "import static org.junit.jupiter.api.Assertions.*;\n\n" +
                "/**\n" +
                " * Test class for %sApplication\n" +
                " */\n" +
                "@SpringBootTest\n" +
                "class %sApplicationTest {\n\n" +
                "    @Test\n" +
                "    void contextLoads() {\n" +
                "        // Test that the Spring context loads successfully\n" +
                "    }\n\n" +
                "    @Test\n" +
                "    void testExample() {\n" +
                "        // Add your test cases here\n" +
                "        assertTrue(true, \"This test should pass\");\n" +
                "    }\n" +
                "}",
                config.getPackageName(),
                className,
                className
            );
        } else if (hasJUnit) {
            return String.format(
                "package %s;\n\n" +
                "import org.junit.jupiter.api.Test;\n" +
                "import static org.junit.jupiter.api.Assertions.*;\n\n" +
                "/**\n" +
                " * Test class for %sApplication\n" +
                " */\n" +
                "class %sApplicationTest {\n\n" +
                "    @Test\n" +
                "    void testMain() {\n" +
                "        // Test that main method runs without exception\n" +
                "        assertDoesNotThrow(() -> {\n" +
                "            %sApplication.main(new String[]{});\n" +
                "        });\n" +
                "    }\n\n" +
                "    @Test\n" +
                "    void testExample() {\n" +
                "        // Add your test cases here\n" +
                "        assertTrue(true, \"This test should pass\");\n" +
                "    }\n" +
                "}",
                config.getPackageName(),
                className,
                className,
                className
            );
        } else {
            return String.format(
                "package %s;\n\n" +
                "/**\n" +
                " * Test class for %sApplication\n" +
                " * Note: Add JUnit dependency to enable proper testing\n" +
                " */\n" +
                "public class %sApplicationTest {\n\n" +
                "    public void testMain() {\n" +
                "        // Test that main method runs without exception\n" +
                "        try {\n" +
                "            %sApplication.main(new String[]{});\n" +
                "            System.out.println(\"Main method executed successfully\");\n" +
                "        } catch (Exception e) {\n" +
                "            throw new RuntimeException(\"Main method failed\", e);\n" +
                "        }\n" +
                "    }\n" +
                "}",
                config.getPackageName(),
                className,
                className,
                className
            );
        }
    }

    private String generateReadme(ProjectConfig config) {
        String className = generateClassName(config.getArtifactId());
        StringBuilder dependenciesList = new StringBuilder();
        
        if (config.getDependencies() != null && !config.getDependencies().isEmpty()) {
            for (Dependency dep : config.getDependencies()) {
                dependenciesList.append(String.format(
                    "- **%s** (%s:%s:%s) - %s\n",
                    dep.getName(), dep.getGroupId(), dep.getArtifactId(), 
                    dep.getVersion(), dep.getDescription()
                ));
            }
        } else {
            dependenciesList.append("No additional dependencies selected.");
        }

        StringBuilder features = new StringBuilder();
        if (config.getDockerTemplate() != null && !config.getDockerTemplate().isEmpty()) {
            features.append("- 🐳 **Docker Support**: Includes Dockerfile for containerization\n");
        }
        if (config.getCicdTemplate() != null && !config.getCicdTemplate().isEmpty()) {
            features.append("- 🚀 **CI/CD Pipeline**: Includes CI/CD configuration\n");
        }
        features.append("- 📦 **Maven Wrapper**: Includes Maven Wrapper for consistent builds\n");
        features.append("- 🧪 **Testing Setup**: Includes test configuration\n");

        return String.format(
            "# %s\n\n" +
            "%s\n\n" +
            "## Project Information\n\n" +
            "- **Group ID:** %s\n" +
            "- **Artifact ID:** %s\n" +
            "- **Version:** %s\n" +
            "- **Java Version:** %s\n" +
            "- **Packaging:** %s\n\n" +
            "## Features\n\n" +
            "%s\n" +
            "## Dependencies\n\n" +
            "%s\n\n" +
            "## Getting Started\n\n" +
            "### Prerequisites\n\n" +
            "- Java %s or higher\n" +
            "- Maven 3.6.0 or higher (or use Maven Wrapper)\n\n" +
            "### Building the Project\n\n" +
            "```bash\n" +
            "# Using Maven Wrapper (recommended)\n" +
            "./mvnw clean compile\n\n" +
            "# Or using Maven directly\n" +
            "mvn clean compile\n" +
            "```\n\n" +
            "### Running Tests\n\n" +
            "```bash\n" +
            "# Using Maven Wrapper\n" +
            "./mvnw test\n\n" +
            "# Or using Maven directly\n" +
            "mvn test\n" +
            "```\n\n" +
            "### Running the Application\n\n" +
            "```bash\n" +
            "# Using Maven Wrapper\n" +
            "./mvnw exec:java -Dexec.mainClass=\"%s.%sApplication\"\n\n" +
            "# Or using Maven directly\n" +
            "mvn exec:java -Dexec.mainClass=\"%s.%sApplication\"\n" +
            "```\n\n" +
            "### Packaging\n\n" +
            "```bash\n" +
            "# Using Maven Wrapper\n" +
            "./mvnw clean package\n\n" +
            "# Or using Maven directly\n" +
            "mvn clean package\n" +
            "```\n\n" +
            "## Project Structure\n\n" +
            "```\n" +
            "%s/\n" +
            "├── pom.xml\n" +
            "├── README.md\n" +
            "├── mvnw\n" +
            "├── mvnw.cmd\n" +
            "├── .mvn/\n" +
            "│   └── wrapper/\n" +
            "│       ├── maven-wrapper.jar\n" +
            "│       └── maven-wrapper.properties\n" +
            "├── src/\n" +
            "│   ├── main/\n" +
            "│   │   ├── java/\n" +
            "│   │   │   └── %s/\n" +
            "│   │   │       └── %sApplication.java\n" +
            "│   │   └── resources/\n" +
            "│   │       └── application.properties\n" +
            "│   └── test/\n" +
            "│       └── java/\n" +
            "│           └── %s/\n" +
            "│               └── %sApplicationTest.java\n" +
            "```\n\n" +
            "---\n\n" +
            "Generated by [Maven Initializer](https://maven-initializer.example.com)\n",
            config.getName() != null && !config.getName().isEmpty() ? config.getName() : config.getArtifactId(),
            config.getDescription() != null && !config.getDescription().isEmpty() ? 
                config.getDescription() : "A Maven project generated by Maven Initializer",
            config.getGroupId(),
            config.getArtifactId(),
            config.getVersion(),
            config.getJavaVersion(),
            config.getPackaging(),
            features.toString(),
            dependenciesList.toString(),
            config.getJavaVersion(),
            config.getPackageName(),
            className,
            config.getPackageName(),
            className,
            config.getArtifactId(),
            config.getPackageName().replace(".", "/"),
            className,
            config.getPackageName().replace(".", "/"),
            className
        );
    }

    private String generateGitignore() {
        return "# Compiled class file\n" +
               "*.class\n\n" +
               "# Log file\n" +
               "*.log\n\n" +
               "# BlueJ files\n" +
               "*.ctxt\n\n" +
               "# Mobile Tools for Java (J2ME)\n" +
               ".mtj.tmp/\n\n" +
               "# Package Files #\n" +
               "*.jar\n" +
               "*.war\n" +
               "*.nar\n" +
               "*.ear\n" +
               "*.zip\n" +
               "*.tar.gz\n" +
               "*.rar\n\n" +
               "# virtual machine crash logs\n" +
               "hs_err_pid*\n" +
               "replay_pid*\n\n" +
               "# Maven\n" +
               "target/\n" +
               "pom.xml.tag\n" +
               "pom.xml.releaseBackup\n" +
               "pom.xml.versionsBackup\n" +
               "pom.xml.next\n" +
               "release.properties\n" +
               "dependency-reduced-pom.xml\n" +
               "buildNumber.properties\n" +
               ".mvn/timing.properties\n" +
               ".mvn/wrapper/maven-wrapper.jar\n\n" +
               "# IDE\n" +
               ".idea/\n" +
               "*.iws\n" +
               "*.iml\n" +
               "*.ipr\n" +
               ".vscode/\n" +
               ".classpath\n" +
               ".project\n" +
               ".settings/\n\n" +
               "# OS\n" +
               ".DS_Store\n" +
               "Thumbs.db\n\n" +
               "# Docker\n" +
               ".dockerignore\n\n" +
               "# CI/CD\n" +
               ".github/\n" +
               ".gitlab-ci.yml\n";
    }
}

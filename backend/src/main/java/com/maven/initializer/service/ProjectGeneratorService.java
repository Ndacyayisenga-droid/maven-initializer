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
public class ProjectGeneratorService {

    public byte[] generateProject(ProjectConfig config) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            // Generate pom.xml
            addFileToZip(zos, "pom.xml", generatePomXml(config));
            
            // Generate README.md
            addFileToZip(zos, "README.md", generateReadme(config));
            
            // Generate .gitignore
            addFileToZip(zos, ".gitignore", generateGitignore());
            
            // Create directory structure and add main Java class
            String packagePath = config.getPackageName().replace(".", "/");
            String mainClassName = generateClassName(config.getArtifactId()) + "Application.java";
            addFileToZip(zos, "src/main/java/" + packagePath + "/" + mainClassName, 
                        generateMainClass(config));
            
            // Add test Java class
            String testClassName = generateClassName(config.getArtifactId()) + "ApplicationTest.java";
            addFileToZip(zos, "src/test/java/" + packagePath + "/" + testClassName, 
                        generateTestClass(config));
            
            // Add empty resources directories
            addFileToZip(zos, "src/main/resources/.gitkeep", "");
            addFileToZip(zos, "src/test/resources/.gitkeep", "");
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
            "            </plugin>\n" +
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
            config.getJavaVersion()
        );
    }

    private String generateMainClass(ProjectConfig config) {
        String className = generateClassName(config.getArtifactId());
        
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

    private String generateTestClass(ProjectConfig config) {
        String className = generateClassName(config.getArtifactId());
        boolean hasJUnit = config.getDependencies() != null && 
            config.getDependencies().stream()
                .anyMatch(dep -> "org.junit.jupiter".equals(dep.getGroupId()));

        if (hasJUnit) {
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

        return String.format(
            "# %s\n\n" +
            "%s\n\n" +
            "## Project Information\n\n" +
            "- **Group ID:** %s\n" +
            "- **Artifact ID:** %s\n" +
            "- **Version:** %s\n" +
            "- **Java Version:** %s\n" +
            "- **Packaging:** %s\n\n" +
            "## Dependencies\n\n" +
            "%s\n\n" +
            "## Getting Started\n\n" +
            "### Prerequisites\n\n" +
            "- Java %s or higher\n" +
            "- Maven 3.6.0 or higher\n\n" +
            "### Building the Project\n\n" +
            "```bash\n" +
            "mvn clean compile\n" +
            "```\n\n" +
            "### Running Tests\n\n" +
            "```bash\n" +
            "mvn test\n" +
            "```\n\n" +
            "### Running the Application\n\n" +
            "```bash\n" +
            "mvn exec:java -Dexec.mainClass=\"%s.%sApplication\"\n" +
            "```\n\n" +
            "### Packaging\n\n" +
            "```bash\n" +
            "mvn clean package\n" +
            "```\n\n" +
            "## Project Structure\n\n" +
            "```\n" +
            "%s/\n" +
            "├── pom.xml\n" +
            "├── README.md\n" +
            "├── src/\n" +
            "│   ├── main/\n" +
            "│   │   ├── java/\n" +
            "│   │   │   └── %s/\n" +
            "│   │   │       └── %sApplication.java\n" +
            "│   │   └── resources/\n" +
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
            dependenciesList.toString(),
            config.getJavaVersion(),
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
               "Thumbs.db\n";
    }
}

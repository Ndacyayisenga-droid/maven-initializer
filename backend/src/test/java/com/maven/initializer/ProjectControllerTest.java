package com.maven.initializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maven.initializer.controller.ProjectController;
import com.maven.initializer.model.Dependency;
import com.maven.initializer.model.ProjectConfig;
import com.maven.initializer.service.ProjectGeneratorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectGeneratorService projectGeneratorService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Maven Initializer API is running"));
    }

    @Test
    void testGenerateProject() throws Exception {
        // Create test project config
        ProjectConfig config = new ProjectConfig();
        config.setGroupId("com.example");
        config.setArtifactId("test-project");
        config.setVersion("1.0.0");
        config.setPackageName("com.example.testproject");
        config.setPackaging("jar");
        config.setJavaVersion("17");
        config.setMavenVersion("3.9.0");
        
        Dependency junit = new Dependency("junit", "JUnit", "Testing framework", 
                                        "Testing", "org.junit.jupiter", "junit-jupiter", "5.10.0");
        config.setDependencies(Arrays.asList(junit));

        // Mock service response
        byte[] mockZipData = "mock zip data".getBytes();
        when(projectGeneratorService.generateProject(any(ProjectConfig.class)))
                .thenReturn(mockZipData);

        // Perform request
        mockMvc.perform(post("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(config)))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/octet-stream"))
                .andExpect(header().string("Content-Disposition", "form-data; name=\"attachment\"; filename=\"test-project.zip\""))
                .andExpect(content().bytes(mockZipData));
    }
}

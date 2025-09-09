package com.maven.initializer.controller;

import com.maven.initializer.model.ProjectConfig;
import com.maven.initializer.service.ProjectGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Configure this properly for production
public class ProjectController {

    @Autowired
    private ProjectGeneratorService projectGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateProject(@RequestBody ProjectConfig config) {
        try {
            // Validate required fields
            if (config.getGroupId() == null || config.getGroupId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Group ID is required"));
            }
            if (config.getArtifactId() == null || config.getArtifactId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Artifact ID is required"));
            }
            if (config.getVersion() == null || config.getVersion().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Version is required"));
            }
            if (config.getPackageName() == null || config.getPackageName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Package name is required"));
            }

            byte[] zipData = projectGeneratorService.generateProject(config);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", config.getArtifactId() + ".zip");
            headers.setContentLength(zipData.length);
            
            return new ResponseEntity<>(zipData, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            System.err.println("IO Error generating project: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to generate project: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error generating project: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Unexpected error: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Maven Initializer API is running");
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}

package com.maven.initializer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Dependency {
    private String id;
    private String name;
    private String description;
    private String category;
    
    @JsonProperty("groupId")
    private String groupId;
    
    @JsonProperty("artifactId")
    private String artifactId;
    
    private String version;

    // Default constructor
    public Dependency() {}

    // Constructor with all fields
    public Dependency(String id, String name, String description, String category, 
                     String groupId, String artifactId, String version) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.groupId = groupId;
        this.artifactId = artifactId;
        this.version = version;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }

    public String getArtifactId() { return artifactId; }
    public void setArtifactId(String artifactId) { this.artifactId = artifactId; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}

package com.maven.initializer.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class ProjectConfig {
    @JsonProperty("groupId")
    private String groupId;
    
    @JsonProperty("artifactId")
    private String artifactId;
    
    private String version;
    private String name;
    private String description;
    
    @JsonProperty("packageName")
    private String packageName;
    
    private String packaging;
    
    @JsonProperty("javaVersion")
    private String javaVersion;
    
    @JsonProperty("mavenVersion")
    private String mavenVersion;
    
    private List<Dependency> dependencies;
    private String template;
    
    @JsonProperty("dockerTemplate")
    private String dockerTemplate;
    
    @JsonProperty("cicdTemplate")
    private String cicdTemplate;
    
    @JsonProperty("advancedMaven")
    private Boolean advancedMaven;

    // Default constructor
    public ProjectConfig() {}

    // Getters and Setters
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }

    public String getArtifactId() { return artifactId; }
    public void setArtifactId(String artifactId) { this.artifactId = artifactId; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getPackaging() { return packaging; }
    public void setPackaging(String packaging) { this.packaging = packaging; }

    public String getJavaVersion() { return javaVersion; }
    public void setJavaVersion(String javaVersion) { this.javaVersion = javaVersion; }

    public String getMavenVersion() { return mavenVersion; }
    public void setMavenVersion(String mavenVersion) { this.mavenVersion = mavenVersion; }

    public List<Dependency> getDependencies() { return dependencies; }
    public void setDependencies(List<Dependency> dependencies) { this.dependencies = dependencies; }

    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }

    public String getDockerTemplate() { return dockerTemplate; }
    public void setDockerTemplate(String dockerTemplate) { this.dockerTemplate = dockerTemplate; }

    public String getCicdTemplate() { return cicdTemplate; }
    public void setCicdTemplate(String cicdTemplate) { this.cicdTemplate = cicdTemplate; }

    public Boolean getAdvancedMaven() { return advancedMaven; }
    public void setAdvancedMaven(Boolean advancedMaven) { this.advancedMaven = advancedMaven; }
}

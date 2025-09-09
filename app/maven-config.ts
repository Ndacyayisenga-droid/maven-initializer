export interface MavenPlugin {
  groupId: string
  artifactId: string
  version: string
  configuration?: Record<string, any>
  executions?: Array<{
    id: string
    phase: string
    goals: string[]
  }>
}

export interface MavenProperty {
  name: string
  value: string
  description: string
}

export interface AdvancedMavenConfig {
  plugins: MavenPlugin[]
  properties: MavenProperty[]
  profiles: Array<{
    id: string
    name: string
    description: string
    properties: MavenProperty[]
  }>
}

export const mavenPlugins: MavenPlugin[] = [
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-compiler-plugin",
    version: "3.11.0",
    configuration: {
      source: "17",
      target: "17"
    }
  },
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-surefire-plugin",
    version: "3.1.2",
    configuration: {
      useSystemClassLoader: false
    }
  },
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-failsafe-plugin",
    version: "3.1.2",
    configuration: {
      useSystemClassLoader: false
    }
  },
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-jar-plugin",
    version: "3.3.0",
    configuration: {
      archive: {
        manifest: {
          addDefaultImplementationEntries: true,
          addDefaultSpecificationEntries: true
        }
      }
    }
  },
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-source-plugin",
    version: "3.3.0",
    executions: [{
      id: "attach-sources",
      phase: "verify",
      goals: ["jar-no-fork"]
    }]
  },
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-javadoc-plugin",
    version: "3.6.0",
    configuration: {
      source: "17",
      target: "17"
    },
    executions: [{
      id: "attach-javadocs",
      phase: "verify",
      goals: ["jar"]
    }]
  },
  {
    groupId: "org.apache.maven.plugins",
    artifactId: "maven-shade-plugin",
    version: "3.5.0",
    configuration: {
      createDependencyReducedPom: false
    },
    executions: [{
      id: "shade",
      phase: "package",
      goals: ["shade"]
    }]
  },
  {
    groupId: "org.springframework.boot",
    artifactId: "spring-boot-maven-plugin",
    version: "3.2.0",
    configuration: {
      executable: true
    },
    executions: [{
      id: "repackage",
      phase: "package",
      goals: ["repackage"]
    }]
  },
  {
    groupId: "org.jacoco",
    artifactId: "jacoco-maven-plugin",
    version: "0.8.11",
    executions: [{
      id: "prepare-agent",
      phase: "initialize",
      goals: ["prepare-agent"]
    }, {
      id: "report",
      phase: "verify",
      goals: ["report"]
    }]
  },
  {
    groupId: "org.sonarsource.scanner.maven",
    artifactId: "sonar-maven-plugin",
    version: "3.10.0.2594"
  }
]

export const mavenProperties: MavenProperty[] = [
  {
    name: "maven.compiler.source",
    value: "17",
    description: "Java source version"
  },
  {
    name: "maven.compiler.target",
    value: "17",
    description: "Java target version"
  },
  {
    name: "project.build.sourceEncoding",
    value: "UTF-8",
    description: "Source file encoding"
  },
  {
    name: "project.reporting.outputEncoding",
    value: "UTF-8",
    description: "Report output encoding"
  },
  {
    name: "maven.compiler.release",
    value: "17",
    description: "Java release version"
  },
  {
    name: "maven.compiler.fork",
    value: "true",
    description: "Fork the compiler process"
  },
  {
    name: "maven.compiler.maxmem",
    value: "1024m",
    description: "Maximum memory for compiler"
  },
  {
    name: "maven.test.skip",
    value: "false",
    description: "Skip running tests"
  },
  {
    name: "maven.javadoc.skip",
    value: "false",
    description: "Skip generating javadoc"
  },
  {
    name: "maven.source.skip",
    value: "false",
    description: "Skip generating source jar"
  }
]

export const mavenProfiles = [
  {
    id: "dev",
    name: "Development",
    description: "Development profile with debug logging",
    properties: [
      {
        name: "spring.profiles.active",
        value: "dev",
        description: "Active Spring profile"
      },
      {
        name: "logging.level.root",
        value: "DEBUG",
        description: "Root logging level"
      }
    ]
  },
  {
    id: "test",
    name: "Test",
    description: "Test profile with test database",
    properties: [
      {
        name: "spring.profiles.active",
        value: "test",
        description: "Active Spring profile"
      },
      {
        name: "spring.datasource.url",
        value: "jdbc:h2:mem:testdb",
        description: "Test database URL"
      }
    ]
  },
  {
    id: "prod",
    name: "Production",
    description: "Production profile with optimized settings",
    properties: [
      {
        name: "spring.profiles.active",
        value: "prod",
        description: "Active Spring profile"
      },
      {
        name: "logging.level.root",
        value: "WARN",
        description: "Root logging level"
      }
    ]
  }
]

export const getDefaultMavenConfig = (): AdvancedMavenConfig => ({
  plugins: mavenPlugins.slice(0, 4), // Basic plugins
  properties: mavenProperties.slice(0, 4), // Basic properties
  profiles: []
})

export const getSpringBootMavenConfig = (): AdvancedMavenConfig => ({
  plugins: [
    ...mavenPlugins.slice(0, 4),
    mavenPlugins.find(p => p.artifactId === "spring-boot-maven-plugin")!
  ],
  properties: mavenProperties.slice(0, 4),
  profiles: mavenProfiles
})

export const getFullMavenConfig = (): AdvancedMavenConfig => ({
  plugins: mavenPlugins,
  properties: mavenProperties,
  profiles: mavenProfiles
})

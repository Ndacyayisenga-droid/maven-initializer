"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Search, X, Package, Code, Settings, BookOpen, Loader2, Sparkles, Zap, Shield, Rocket, FileText, Wrench, Container, GitBranch } from "lucide-react"
import { validateProjectConfig, validateDependencies, type ValidationError } from "@/lib/validation"
import { ValidationAlert, ValidationSuccess } from "@/components/validation-alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from "@/components/validated-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProjectPreview } from "@/components/project-preview"
import { dependencies, categories, popularDependencies, searchDependencies } from "./dependencies"
import { projectTemplates, templateCategories, getTemplateById } from "./templates"
import { getDefaultMavenConfig, getSpringBootMavenConfig, getFullMavenConfig } from "./maven-config"
import { dockerTemplates, cicdTemplates, getDockerTemplateById, getCICDTemplateById } from "./cicd-templates"

interface Dependency {
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

export default function MavenInitializer() {
  const [projectConfig, setProjectConfig] = useState({
    groupId: "com.example",
    artifactId: "my-project",
    version: "1.0.0",
    name: "",
    description: "",
    packageName: "com.example.myproject",
    packaging: "jar",
    javaVersion: "17",
    mavenVersion: "3.9.0",
  })

  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedDockerTemplate, setSelectedDockerTemplate] = useState<string | null>(null)
  const [selectedCICDTemplate, setSelectedCICDTemplate] = useState<string | null>(null)

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [dependencyErrors, setDependencyErrors] = useState<ValidationError[]>([])
  const [isConfigValid, setIsConfigValid] = useState(false)

  useEffect(() => {
    validateConfiguration()
  }, [projectConfig, selectedDependencies])

  const filteredDependencies = dependencies.filter((dep) => {
    const matchesSearch =
      dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = activeCategory === "All" || dep.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleDependencyToggle = (depId: string) => {
    setSelectedDependencies((prev) => (prev.includes(depId) ? prev.filter((id) => id !== depId) : [...prev, depId]))
  }

  const removeDependency = (depId: string) => {
    setSelectedDependencies((prev) => prev.filter((id) => id !== depId))
  }

  const applyTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      setProjectConfig(prev => ({
        ...prev,
        javaVersion: template.javaVersion,
        packaging: template.packaging,
      }))
      setSelectedDependencies(template.dependencies)
      setSelectedTemplate(templateId)
    }
  }

  const validateConfiguration = () => {
    const configValidation = validateProjectConfig(projectConfig)
    const selectedDeps = dependencies.filter((dep) => selectedDependencies.includes(dep.id))
    const depValidation = validateDependencies(selectedDeps)

    setValidationErrors(configValidation.errors)
    setDependencyErrors(depValidation.errors)
    setIsConfigValid(configValidation.isValid && depValidation.isValid)

    return configValidation.isValid && depValidation.isValid
  }

  const generateProject = async () => {
    if (!validateConfiguration()) {
      return
    }

    setIsGenerating(true)
    try {
      const selectedDeps = dependencies.filter((dep) => selectedDependencies.includes(dep.id))

      const response = await fetch("http://localhost:8080/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...projectConfig,
          dependencies: selectedDeps,
          template: selectedTemplate,
          dockerTemplate: selectedDockerTemplate,
          cicdTemplate: selectedCICDTemplate,
          advancedMaven: showAdvanced,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate project")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${projectConfig.artifactId}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error generating project:", error)
      alert("Failed to generate project. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10" />
        <div className="relative">
          <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      Maven Initializer
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Bootstrap your Maven project with ease</p>
                  </div>
                </div>
                <nav className="flex items-center gap-6">
                  <ThemeToggle />
                  <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-2 transition-colors">
                    <BookOpen className="h-4 w-4" />
                    Documentation
                  </a>
                  <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    GitHub
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Generate Maven projects in seconds
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
                Build Better Java Projects
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Create production-ready Maven projects with the perfect dependencies, 
                configuration, and structure. No more manual setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Enterprise-ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Rocket className="h-4 w-4 text-blue-500" />
                  <span>Lightning fast</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>Best practices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dependencyErrors.length > 0 && (
          <div className="mb-6">
            <ValidationAlert errors={dependencyErrors} type="warning" />
          </div>
        )}

        {isConfigValid && (
          <ValidationSuccess message="Your project is ready to generate!" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Templates */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Project Templates
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Choose a predefined template to get started quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      onClick={() => applyTemplate(template.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h3 className="font-medium text-sm">{template.name}</h3>
                          <p className="text-xs text-slate-500">{template.category}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Configuration */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Project Metadata
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Configure your Maven project settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedInput
                    id="groupId"
                    label="Group ID"
                    value={projectConfig.groupId}
                    onChange={(value) => setProjectConfig((prev) => ({ ...prev, groupId: value }))}
                    placeholder="com.example"
                    errors={validationErrors}
                  />

                  <ValidatedInput
                    id="artifactId"
                    label="Artifact ID"
                    value={projectConfig.artifactId}
                    onChange={(value) => setProjectConfig((prev) => ({ ...prev, artifactId: value }))}
                    placeholder="my-project"
                    errors={validationErrors}
                  />

                  <ValidatedInput
                    id="version"
                    label="Version"
                    value={projectConfig.version}
                    onChange={(value) => setProjectConfig((prev) => ({ ...prev, version: value }))}
                    placeholder="1.0.0"
                    errors={validationErrors}
                  />

                  <ValidatedSelect
                    id="packaging"
                    label="Packaging"
                    value={projectConfig.packaging}
                    onChange={(value) => setProjectConfig((prev) => ({ ...prev, packaging: value }))}
                    options={[
                      { value: "jar", label: "JAR" },
                      { value: "war", label: "WAR" },
                      { value: "pom", label: "POM" },
                    ]}
                    errors={validationErrors}
                  />

                  <ValidatedSelect
                    id="javaVersion"
                    label="Java Version"
                    value={projectConfig.javaVersion}
                    onChange={(value) => setProjectConfig((prev) => ({ ...prev, javaVersion: value }))}
                    options={[
                      { value: "8", label: "Java 8" },
                      { value: "11", label: "Java 11" },
                      { value: "17", label: "Java 17" },
                      { value: "21", label: "Java 21" },
                    ]}
                    errors={validationErrors}
                  />

                  <ValidatedSelect
                    id="mavenVersion"
                    label="Maven Version"
                    value={projectConfig.mavenVersion}
                    onChange={(value) => setProjectConfig((prev) => ({ ...prev, mavenVersion: value }))}
                    options={[
                      { value: "3.8.0", label: "3.8.0" },
                      { value: "3.9.0", label: "3.9.0" },
                      { value: "3.9.6", label: "3.9.6" },
                    ]}
                    errors={validationErrors}
                  />
                </div>

                <ValidatedInput
                  id="name"
                  label="Project Name"
                  value={projectConfig.name}
                  onChange={(value) => setProjectConfig((prev) => ({ ...prev, name: value }))}
                  placeholder="My Awesome Project"
                  errors={validationErrors}
                />

                <ValidatedTextarea
                  id="description"
                  label="Description"
                  value={projectConfig.description}
                  onChange={(value) => setProjectConfig((prev) => ({ ...prev, description: value }))}
                  placeholder="A brief description of your project"
                  rows={3}
                  errors={validationErrors}
                />

                <ValidatedInput
                  id="packageName"
                  label="Package Name"
                  value={projectConfig.packageName}
                  onChange={(value) => setProjectConfig((prev) => ({ ...prev, packageName: value }))}
                  placeholder="com.example.myproject"
                  errors={validationErrors}
                />
              </CardContent>
            </Card>

            {/* Dependencies */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Dependencies
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Add dependencies to your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search dependencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-slate-100 dark:bg-slate-700">
                      <TabsTrigger value="All" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                        All
                      </TabsTrigger>
                      {categories.slice(0, 5).map((category) => (
                        <TabsTrigger key={category} value={category} className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value={activeCategory} className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {filteredDependencies.map((dep) => (
                          <div
                            key={dep.id}
                            className="group flex items-start space-x-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
                            onClick={() => handleDependencyToggle(dep.id)}
                          >
                            <Checkbox
                              id={dep.id}
                              checked={selectedDependencies.includes(dep.id)}
                              onCheckedChange={() => handleDependencyToggle(dep.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <label htmlFor={dep.id} className="text-sm font-medium cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {dep.name}
                                </label>
                                {dep.popular && (
                                  <Badge variant="secondary" className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{dep.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                                  {dep.category}
                                </Badge>
                                {dep.tags && dep.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Advanced Options
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Additional configuration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Advanced Maven Configuration</h3>
                    <p className="text-sm text-slate-500">Include additional Maven plugins and properties</p>
                  </div>
                  <Checkbox
                    checked={showAdvanced}
                    onCheckedChange={setShowAdvanced}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Docker Template</Label>
                    <select
                      value={selectedDockerTemplate || ""}
                      onChange={(e) => setSelectedDockerTemplate(e.target.value || null)}
                      className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                    >
                      <option value="">No Docker</option>
                      {dockerTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">CI/CD Template</Label>
                    <select
                      value={selectedCICDTemplate || ""}
                      onChange={(e) => setSelectedCICDTemplate(e.target.value || null)}
                      className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                    >
                      <option value="">No CI/CD</option>
                      {cicdTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Summary & Preview */}
          <div className="space-y-6">
            <ProjectPreview
              projectConfig={projectConfig}
              dependencies={dependencies.filter((dep) => selectedDependencies.includes(dep.id))}
              onDownload={generateProject}
              isGenerating={isGenerating}
            />

            {/* Project Summary */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Project Summary</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Review your configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Group:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{projectConfig.groupId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Artifact:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{projectConfig.artifactId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Version:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{projectConfig.version}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Packaging:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{projectConfig.packaging}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400">Java:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{projectConfig.javaVersion}</span>
                  </div>
                </div>

                {selectedDependencies.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Selected Dependencies</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedDependencies.map((depId) => {
                        const dep = dependencies.find((d) => d.id === depId)
                        return dep ? (
                          <div
                            key={depId}
                            className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg text-xs"
                          >
                            <span className="text-blue-800 dark:text-blue-200">{dep.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDependency(depId)}
                              className="h-5 w-5 p-0 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <p>Standard Maven directory structure</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <p>Sample source files included</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <p>Ready to import in your IDE</p>
                  </div>
                  {selectedDockerTemplate && (
                    <div className="flex items-center gap-2">
                      <Container className="w-3 h-3 text-blue-500" />
                      <p>Docker configuration included</p>
                    </div>
                  )}
                  {selectedCICDTemplate && (
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3 h-3 text-green-500" />
                      <p>CI/CD pipeline included</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

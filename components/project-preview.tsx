"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectFile {
  name: string
  type: "file" | "folder"
  children?: ProjectFile[]
  size?: string
  description?: string
}

interface ProjectPreviewProps {
  projectConfig: {
    artifactId: string
    groupId: string
    version: string
    packageName: string
    javaVersion: string
    packaging: string
  }
  dependencies: Array<{
    name: string
    groupId: string
    artifactId: string
    version: string
  }>
  onDownload: () => void
  isGenerating: boolean
}

export function ProjectPreview({ projectConfig, dependencies, onDownload, isGenerating }: ProjectPreviewProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root", "src", "src/main", "src/test"]))

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const generateProjectStructure = (): ProjectFile[] => {
    const packagePath = projectConfig.packageName.replace(/\./g, "/")
    
    return [
      {
        name: projectConfig.artifactId,
        type: "folder",
        children: [
          {
            name: "pom.xml",
            type: "file",
            description: "Maven project configuration",
            size: "~2KB"
          },
          {
            name: "README.md",
            type: "file",
            description: "Project documentation",
            size: "~3KB"
          },
          {
            name: ".gitignore",
            type: "file",
            description: "Git ignore rules",
            size: "~1KB"
          },
          {
            name: "src",
            type: "folder",
            children: [
              {
                name: "main",
                type: "folder",
                children: [
                  {
                    name: "java",
                    type: "folder",
                    children: [
                      {
                        name: packagePath,
                        type: "folder",
                        children: [
                          {
                            name: `${projectConfig.artifactId.charAt(0).toUpperCase() + projectConfig.artifactId.slice(1)}Application.java`,
                            type: "file",
                            description: "Main application class",
                            size: "~1KB"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    name: "resources",
                    type: "folder",
                    children: [
                      {
                        name: "application.properties",
                        type: "file",
                        description: "Application configuration",
                        size: "~500B"
                      }
                    ]
                  }
                ]
              },
              {
                name: "test",
                type: "folder",
                children: [
                  {
                    name: "java",
                    type: "folder",
                    children: [
                      {
                        name: packagePath,
                        type: "folder",
                        children: [
                          {
                            name: `${projectConfig.artifactId.charAt(0).toUpperCase() + projectConfig.artifactId.slice(1)}ApplicationTest.java`,
                            type: "file",
                            description: "Test class",
                            size: "~1KB"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    name: "resources",
                    type: "folder",
                    children: []
                  }
                ]
              }
            ]
          },
          {
            name: "target",
            type: "folder",
            description: "Build output directory (generated)",
            children: []
          }
        ]
      }
    ]
  }

  const renderFileTree = (files: ProjectFile[], path = "root", level = 0) => {
    return files.map((file, index) => {
      const fullPath = path === "root" ? file.name : `${path}/${file.name}`
      const isExpanded = expandedFolders.has(fullPath)
      const isFolder = file.type === "folder"
      const hasChildren = file.children && file.children.length > 0

      return (
        <div key={fullPath} className="select-none">
          <div
            className={cn(
              "flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
              level > 0 && "ml-4"
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => isFolder && toggleFolder(fullPath)}
          >
            {isFolder ? (
              <>
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )
                ) : (
                  <div className="w-4" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500" />
                )}
              </>
            ) : (
              <>
                <div className="w-4" />
                <File className="h-4 w-4 text-slate-500" />
              </>
            )}
            <span className="text-sm font-medium">{file.name}</span>
            {file.size && (
              <Badge variant="secondary" className="text-xs">
                {file.size}
              </Badge>
            )}
            {file.description && (
              <span className="text-xs text-slate-500 ml-auto">
                {file.description}
              </span>
            )}
          </div>
          {isFolder && isExpanded && hasChildren && (
            <div>
              {renderFileTree(file.children!, fullPath, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  const projectStructure = generateProjectStructure()

  return (
    <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          📁 Project Structure Preview
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Preview the generated project structure before downloading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div>
            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">Project Details</h4>
            <div className="space-y-1 text-xs">
              <div><span className="text-slate-500">Name:</span> {projectConfig.artifactId}</div>
              <div><span className="text-slate-500">Group:</span> {projectConfig.groupId}</div>
              <div><span className="text-slate-500">Version:</span> {projectConfig.version}</div>
              <div><span className="text-slate-500">Java:</span> {projectConfig.javaVersion}</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">Dependencies</h4>
            <div className="text-xs text-slate-500">
              {dependencies.length} dependency{dependencies.length !== 1 ? 'ies' : ''} selected
            </div>
            {dependencies.length > 0 && (
              <div className="mt-2 space-y-1">
                {dependencies.slice(0, 3).map((dep, index) => (
                  <div key={index} className="text-xs">
                    {dep.name}
                  </div>
                ))}
                {dependencies.length > 3 && (
                  <div className="text-xs text-slate-500">
                    +{dependencies.length - 3} more...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* File Tree */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900/50">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Generated Files & Folders
          </div>
          <div className="max-h-64 overflow-y-auto">
            {renderFileTree(projectStructure)}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={onDownload}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

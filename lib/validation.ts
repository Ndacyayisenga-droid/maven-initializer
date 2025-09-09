import { z } from "zod"

// Simplified Maven naming conventions validation
const MAVEN_ID_REGEX = /^[a-zA-Z0-9._-]+$/
const JAVA_PACKAGE_REGEX = /^[a-zA-Z_$][a-zA-Z\d_$]*(\.[a-zA-Z_$][a-zA-Z\d_$]*)*$/
const ARTIFACT_ID_REGEX = /^[a-z][a-z0-9-]*$/

export const projectConfigSchema = z.object({
  groupId: z
    .string()
    .min(1, "Group ID is required")
    .regex(MAVEN_ID_REGEX, "Group ID must contain only letters, numbers, dots, hyphens, and underscores")
    .refine((val) => !val.startsWith(".") && !val.endsWith("."), "Group ID cannot start or end with a dot"),

  artifactId: z
    .string()
    .min(1, "Artifact ID is required")
    .min(2, "Artifact ID must be at least 2 characters long")
    .max(50, "Artifact ID must be less than 50 characters")
    .regex(
      ARTIFACT_ID_REGEX,
      "Artifact ID must start with a letter and contain only lowercase letters, numbers, and hyphens",
    )
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), "Artifact ID cannot start or end with a hyphen"),

  version: z
    .string()
    .min(1, "Version is required")
    .regex(/^[\d\w.-]+$/, "Version can contain numbers, letters, dots, and hyphens"),

  name: z.string().max(100, "Project name must be less than 100 characters").optional(),

  description: z.string().max(500, "Description must be less than 500 characters").optional(),

  packageName: z
    .string()
    .min(1, "Package name is required")
    .regex(JAVA_PACKAGE_REGEX, "Package name must be a valid Java package name")
    .refine((val) => !val.startsWith(".") && !val.endsWith("."), "Package name cannot start or end with a dot"),

  packaging: z.enum(["jar", "war", "pom"], {
    errorMap: () => ({ message: "Packaging must be jar, war, or pom" }),
  }),

  javaVersion: z.enum(["8", "11", "17", "21"], {
    errorMap: () => ({ message: "Java version must be 8, 11, 17, or 21" }),
  }),

  mavenVersion: z.enum(["3.8.0", "3.9.0", "3.9.6"], {
    errorMap: () => ({ message: "Maven version must be 3.8.0, 3.9.0, or 3.9.6" }),
  }),
})

export type ProjectConfig = z.infer<typeof projectConfigSchema>

export interface ValidationError {
  field: string
  message: string
}

export function validateProjectConfig(config: any): {
  isValid: boolean
  errors: ValidationError[]
  data?: ProjectConfig
} {
  try {
    const validatedData = projectConfigSchema.parse(config)

    // Simplified business logic validations - only essential ones
    const additionalErrors: ValidationError[] = []

    // Check for reserved Java keywords in package name (only critical ones)
    const criticalJavaKeywords = [
      "package",
      "import",
      "class",
      "interface",
      "enum",
      "public",
      "private",
      "protected",
      "static",
      "final",
      "abstract",
    ]

    const packageParts = validatedData.packageName.split(".")
    const hasKeyword = packageParts.some((part) => criticalJavaKeywords.includes(part.toLowerCase()))

    if (hasKeyword) {
      additionalErrors.push({
        field: "packageName",
        message: "Package name cannot contain Java reserved keywords",
      })
    }

    return {
      isValid: additionalErrors.length === 0,
      errors: additionalErrors,
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }))

      return {
        isValid: false,
        errors,
      }
    }

    return {
      isValid: false,
      errors: [{ field: "general", message: "Validation failed" }],
    }
  }
}

export function validateDependencies(dependencies: any[]): {
  isValid: boolean
  errors: ValidationError[]
} {
  const errors: ValidationError[] = []

  // Only check for critical dependency conflicts
  const hasJUnit4 = dependencies.some((dep) => dep.groupId === "junit" && dep.artifactId === "junit")
  const hasJUnit5 = dependencies.some((dep) => dep.groupId === "org.junit.jupiter")

  if (hasJUnit4 && hasJUnit5) {
    errors.push({
      field: "dependencies",
      message: "Cannot use both JUnit 4 and JUnit 5. Please choose one testing framework.",
    })
  }

  // Check for logging conflicts (only critical ones)
  const hasLogback = dependencies.some((dep) => dep.groupId === "ch.qos.logback")
  const hasLog4j = dependencies.some((dep) => dep.groupId === "org.apache.logging.log4j")

  if (hasLogback && hasLog4j) {
    errors.push({
      field: "dependencies",
      message: "Multiple logging implementations detected. Choose either Logback or Log4j.",
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

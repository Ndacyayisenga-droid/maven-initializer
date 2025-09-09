import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import type { ValidationError } from "@/lib/validation"

interface ValidationAlertProps {
  errors: ValidationError[]
  type?: "error" | "warning"
}

export function ValidationAlert({ errors, type = "error" }: ValidationAlertProps) {
  if (errors.length === 0) return null

  const Icon = type === "error" ? XCircle : AlertTriangle
  const variant = type === "error" ? "destructive" : "default"

  return (
    <Alert variant={variant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>
        {type === "error" ? "Please fix the following errors:" : "Warnings:"}
      </AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">
              <strong>{error.field}:</strong> {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

interface ValidationSuccessProps {
  message?: string
}

export function ValidationSuccess({ message = "Configuration is valid!" }: ValidationSuccessProps) {
  return (
    <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertTitle className="text-green-800 dark:text-green-200">Ready to Generate</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-300">
        {message}
      </AlertDescription>
    </Alert>
  )
}

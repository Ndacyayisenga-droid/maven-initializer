"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ValidationError } from "@/lib/validation"

interface ValidationState {
  hasError: boolean
  message?: string
}

interface ValidatedInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  errors: ValidationError[]
  className?: string
  helpText?: string
}

function getValidationState(fieldName: string, errors: ValidationError[]): ValidationState {
  const fieldErrors = errors.filter((error) => error.field === fieldName)
  const hasError = fieldErrors.some(
    (error) => error.message.includes("required") || error.message.includes("must") || error.message.includes("cannot"),
  )

  return {
    hasError,
    message: fieldErrors[0]?.message,
  }
}

export function ValidatedInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  errors,
  className,
  helpText,
}: ValidatedInputProps) {
  const validationState = getValidationState(id, errors)

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          validationState.hasError && "text-red-700 dark:text-red-400",
        )}
      >
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "transition-colors duration-200",
            validationState.hasError && "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400",
          )}
        />
      </div>

      {helpText && !validationState.message && (
        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {validationState.message && (
        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
          <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{validationState.message}</span>
        </div>
      )}
    </div>
  )
}

interface ValidatedTextareaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  errors: ValidationError[]
  className?: string
  helpText?: string
}

export function ValidatedTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  errors,
  className,
  helpText,
}: ValidatedTextareaProps) {
  const validationState = getValidationState(id, errors)

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          validationState.hasError && "text-red-700 dark:text-red-400",
        )}
      >
        {label}
      </Label>

      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "transition-colors duration-200 resize-none",
            validationState.hasError && "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400",
          )}
        />
      </div>

      {helpText && !validationState.message && (
        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {validationState.message && (
        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
          <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{validationState.message}</span>
        </div>
      )}
    </div>
  )
}

interface ValidatedSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  errors: ValidationError[]
  className?: string
  helpText?: string
}

export function ValidatedSelect({
  id,
  label,
  value,
  onChange,
  options,
  errors,
  className,
  helpText,
}: ValidatedSelectProps) {
  const validationState = getValidationState(id, errors)

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          validationState.hasError && "text-red-700 dark:text-red-400",
        )}
      >
        {label}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "transition-colors duration-200",
            validationState.hasError && "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400",
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {helpText && !validationState.message && (
        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {validationState.message && (
        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
          <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{validationState.message}</span>
        </div>
      )}
    </div>
  )
}

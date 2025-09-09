import { Loader2, Package } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <Package className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto animate-float" />
          <div className="absolute inset-0 animate-pulse-slow">
            <div className="w-full h-full rounded-full bg-blue-200 dark:bg-blue-800 opacity-30"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Maven Initializer
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Loading your project configuration...
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Please wait</span>
        </div>
      </div>
    </div>
  )
}

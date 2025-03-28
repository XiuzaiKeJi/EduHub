'use client'

import { useState, useCallback, useEffect } from 'react'
import { Toast, ToastProps } from './toast'

export type ToastOptions = Omit<ToastProps, 'onClose'> & {
  duration?: number
}

interface UseToastReturn {
  toast: (options: ToastOptions) => void
  dismiss: (id?: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2, 11)
    const newToast = { ...options, id }
    
    setToasts((prev) => [...prev, newToast])
    
    if (options.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, options.duration || 5000)
    }
    
    return id
  }, [])

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => 
      id ? prev.filter((t) => t.id !== id) : []
    )
  }, [])

  // 渲染Toasts
  useEffect(() => {
    return () => {
      setToasts([])
    }
  }, [])

  return {
    toast,
    dismiss,
    ToastContainer: () => (
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            title={t.title}
            description={t.description}
            variant={t.variant}
            onClose={() => dismiss(t.id)}
          />
        ))}
      </div>
    )
  }
} 
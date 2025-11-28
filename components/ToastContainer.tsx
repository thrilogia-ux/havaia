'use client'

import { useState, useEffect } from 'react'
import Toast, { type Toast as ToastType } from './Toast'

let toastListeners: Array<(toast: ToastType) => void> = []

export function showToast(message: string, type: ToastType['type'] = 'info', duration?: number) {
  const toast: ToastType = {
    id: Date.now().toString(),
    message,
    type,
    duration,
  }
  
  toastListeners.forEach(listener => listener(toast))
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastType[]>([])

  useEffect(() => {
    const listener = (toast: ToastType) => {
      setToasts(prev => [...prev, toast])
    }
    
    toastListeners.push(listener)
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  )
}





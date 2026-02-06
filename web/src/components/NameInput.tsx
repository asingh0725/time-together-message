'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NameInputProps {
  onSubmit: (name: string) => void
  isLoading?: boolean
}

export function NameInput({ onSubmit, isLoading }: NameInputProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Please enter your name')
      return
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters')
      return
    }

    setError('')
    onSubmit(trimmedName)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <User className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Join this poll</h3>
            <p className="text-sm text-text-secondary">Enter your name to vote</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Your name"
              className={cn(
                'w-full px-4 py-3 bg-background border rounded-xl text-white placeholder-text-tertiary',
                'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent',
                'transition-all',
                error ? 'border-accent-red' : 'border-border'
              )}
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-accent-red">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold',
              'transition-all',
              name.trim()
                ? 'bg-accent-blue text-white hover:bg-blue-600'
                : 'bg-card-hover text-text-tertiary cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue to Vote</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

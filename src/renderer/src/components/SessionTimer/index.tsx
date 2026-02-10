import React, { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface SessionTimerProps {
  loginTimestamp: number
  sessionDurationMs: number
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  loginTimestamp,
  sessionDurationMs
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [isWarning, setIsWarning] = useState<boolean>(false)

  useEffect(() => {
    const calculateRemainingTime = (): void => {
      const now = Date.now()
      const elapsed = now - loginTimestamp
      const remaining = Math.max(0, sessionDurationMs - elapsed)
      setRemainingTime(remaining)

      // Show warning when less than 10 minutes remaining
      const tenMinutesInMs = 10 * 60 * 1000
      setIsWarning(remaining <= tenMinutesInMs && remaining > 0)
    }

    calculateRemainingTime()
    const interval = setInterval(calculateRemainingTime, 1000)

    return (): void => clearInterval(interval)
  }, [loginTimestamp, sessionDurationMs])

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (remainingTime === 0) {
    return null
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isWarning
          ? 'bg-red-900/30 text-red-400 border border-red-700/50'
          : 'bg-zinc-800 text-zinc-300'
      }`}
      title={isWarning ? 'Sessão próxima do fim!' : 'Tempo restante da sessão'}
    >
      {isWarning ? (
        <AlertCircle className="w-4 h-4 animate-pulse" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="font-mono">{formatTime(remainingTime)}</span>
    </div>
  )
}

/* eslint-disable no-console */

/**
 * Minimal logger that prefixes messages and respects a LOG_LEVEL env var.
 * Levels: debug < info < warn < error. Default level is "info".
 */
type Level = 'debug' | 'info' | 'warn' | 'error'

const order: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 }
const current: Level = (process.env.LOG_LEVEL as Level) || 'info'

function shouldLog(level: Level): boolean {
  return order[level] >= order[current]
}

function timestamp(): string {
  return new Date().toISOString()
}

export const logger = {
  debug: (msg: string) => shouldLog('debug') && console.log(`[${timestamp()}] [DEBUG] ${msg}`),
  info: (msg: string) => shouldLog('info') && console.log(`[${timestamp()}] [INFO] ${msg}`),
  warn: (msg: string) => shouldLog('warn') && console.warn(`[${timestamp()}] [WARN] ${msg}`),
  error: (msg: string) => shouldLog('error') && console.error(`[${timestamp()}] [ERROR] ${msg}`),
}

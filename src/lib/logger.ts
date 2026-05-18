/**
 * Lättviktig logger som tystar log/info/warn/debug i produktionsbygget.
 * Errors loggas alltid (de kan vara värdefulla för t.ex. Sentry senare).
 */
const IS_DEV = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (IS_DEV) console.log(...args)
  },
  info: (...args: unknown[]) => {
    if (IS_DEV) console.info(...args)
  },
  warn: (...args: unknown[]) => {
    if (IS_DEV) console.warn(...args)
  },
  debug: (...args: unknown[]) => {
    if (IS_DEV) console.debug(...args)
  },
  error: (...args: unknown[]) => {
    console.error(...args)
  },
}

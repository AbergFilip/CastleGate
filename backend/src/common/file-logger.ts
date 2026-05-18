import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/** Skriver en rad till backend/logs/castlegate.log (för felsökning utan terminal). */
export function writeToLogFile(line: string): void {
  try {
    const logDir = join(process.cwd(), 'logs');
    mkdirSync(logDir, { recursive: true });
    appendFileSync(join(logDir, 'castlegate.log'), new Date().toISOString() + ' ' + line + '\n');
  } catch {
    // ignorerar om fil inte kan skrivas
  }
}

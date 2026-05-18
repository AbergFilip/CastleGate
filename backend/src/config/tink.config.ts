import { join, dirname } from 'path';
import { existsSync, readFileSync } from 'fs';

function loadTinkEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  const mainDir =
    typeof require !== 'undefined' && require.main?.filename
      ? dirname(require.main.filename)
      : __dirname;
  const paths = [
    join(mainDir, '..', '.env'),
    join(__dirname, '..', '..', '.env'),
    join(process.cwd(), '.env'),
    join(process.cwd(), 'backend', '.env'),
  ];
  for (const envPath of paths) {
    if (!existsSync(envPath)) continue;
    try {
      const content = readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const t = line.trim();
        if (t && !t.startsWith('#')) {
          const eq = t.indexOf('=');
          if (eq > 0) {
            const key = t.slice(0, eq).trim();
            const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
            if (key.startsWith('TINK_') && !out[key]) out[key] = val;
          }
        }
      }
      if (out.TINK_CLIENT_ID) break;
    } catch {
      //
    }
  }
  return out;
}

export default () => {
  const env = loadTinkEnv();
  return {
    tink: {
      clientId: env.TINK_CLIENT_ID || process.env.TINK_CLIENT_ID,
      clientSecret: env.TINK_CLIENT_SECRET || process.env.TINK_CLIENT_SECRET,
    },
  };
};

import type { Settings } from "../port";

/** DDL — run once during app setup/migration. */
export const SETTINGS_SCHEMA = `CREATE TABLE IF NOT EXISTS settings (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (scope, key)
);`;

export interface D1SettingsConfig {
  db: D1Database;
  /** Table name (default "settings"). */
  table?: string;
}

export function createD1Settings(config: D1SettingsConfig): Settings {
  const table = config.table ?? "settings";
  return {
    async get<T = unknown>(scope: string, key: string): Promise<T | null> {
      const row = await config.db
        .prepare(`SELECT value FROM ${table} WHERE scope = ? AND key = ?`)
        .bind(scope, key)
        .first<{ value: string }>();
      return row ? (JSON.parse(row.value) as T) : null;
    },
    async set(scope, key, value) {
      await config.db
        .prepare(
          `INSERT INTO ${table} (scope, key, value, updated_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(scope, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        )
        .bind(scope, key, JSON.stringify(value), new Date().toISOString())
        .run();
    },
    async all(scope) {
      const res = await config.db
        .prepare(`SELECT key, value FROM ${table} WHERE scope = ?`)
        .bind(scope)
        .all<{ key: string; value: string }>();
      const out: Record<string, unknown> = {};
      for (const r of res.results ?? []) out[r.key] = JSON.parse(r.value);
      return out;
    },
    async remove(scope, key) {
      await config.db.prepare(`DELETE FROM ${table} WHERE scope = ? AND key = ?`).bind(scope, key).run();
    },
  };
}

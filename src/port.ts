/**
 * The PORT of the settings domain — reusable preferences/config store
 * (so each app stops re-implementing it). `scope` namespaces values, e.g.
 * "user:123" for user preferences or "app" for app config / feature flags.
 */
export interface Settings {
  get<T = unknown>(scope: string, key: string): Promise<T | null>;
  set(scope: string, key: string, value: unknown): Promise<void>;
  all(scope: string): Promise<Record<string, unknown>>;
  remove(scope: string, key: string): Promise<void>;
}
